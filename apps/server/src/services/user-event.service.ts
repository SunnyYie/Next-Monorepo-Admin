import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
import {
  CreateUserEventDto,
  UserEventQueryDto,
  UserEventStatsDto,
  BatchCreateUserEventDto,
  EventType,
} from '../dto/user-event.dto';
import { UserEvent, Prisma } from '../../generated/prisma';

@Injectable()
export class UserEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserEventService.name);
  private batchInterval: NodeJS.Timeout;
  private readonly USER_EVENT_QUEUE_KEY = 'user_events_queue';
  private readonly batchSize: number;
  private readonly batchIntervalMs: number;
  private readonly redisTtl: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.batchSize = this.configService.get<number>(
      'USER_EVENT_BATCH_SIZE',
      100,
    );
    this.batchIntervalMs = this.configService.get<number>(
      'USER_EVENT_BATCH_INTERVAL',
      30000,
    );
    this.redisTtl = this.configService.get<number>(
      'USER_EVENT_REDIS_TTL',
      86400,
    );
  }

  async onModuleInit() {
    // 启动定时批量处理任务
    this.startBatchProcessing();
    this.logger.log('UserEventService 初始化完成，开始定时批量处理任务');
  }

  async onModuleDestroy() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.logger.log('定时批量处理任务已停止');
    }
    // 处理剩余的队列数据
    await this.processBatchEvents();
  }

  /**
   * 启动定时批量处理
   */
  private startBatchProcessing() {
    this.batchInterval = setInterval(async () => {
      try {
        await this.processBatchEvents();
      } catch (error) {
        this.logger.error('定时批量处理失败:', error);
      }
    }, this.batchIntervalMs);
  }

  /**
   * 处理批量事件（从Redis队列到数据库）
   */
  async processBatchEvents() {
    try {
      const queueLength = await this.redis.llen(this.USER_EVENT_QUEUE_KEY);
      if (queueLength === 0) return { processed: 0, message: '队列为空' };

      const batchesToProcess = Math.min(this.batchSize, queueLength);
      const eventStrings = await this.redis.lpopBatch(
        this.USER_EVENT_QUEUE_KEY,
        batchesToProcess,
      );

      if (eventStrings.length === 0)
        return { processed: 0, message: '无事件可处理' };

      const events = eventStrings
        .map((eventStr) => {
          try {
            return JSON.parse(eventStr);
          } catch (error) {
            this.logger.error('解析事件数据失败:', error);
            return null;
          }
        })
        .filter(Boolean);

      if (events.length > 0) {
        await this.prisma.userEvent.createMany({
          data: events,
          skipDuplicates: true,
        });

        this.logger.log(`成功批量保存 ${events.length} 条用户事件到数据库`);
      }

      return {
        processed: events.length,
        message: `成功处理 ${events.length} 条事件`,
      };
    } catch (error) {
      this.logger.error('批量处理事件失败:', error);
      throw error;
    }
  }

  /**
   * 创建单个用户事件（优先存入Redis）
   */
  async createEvent(dto: CreateUserEventDto): Promise<UserEvent> {
    try {
      const eventData: Prisma.UserEventCreateInput = {
        userId: dto.userId,
        userName: dto.userName,
        eventType: dto.eventType,
        eventData: dto.eventData || {},
        pagePath: dto.pagePath,
        pageTitle: dto.pageTitle,
        duration: dto.duration,
        elementId: dto.elementId,
        elementType: dto.elementType?.toString(),
        elementText: dto.elementText,
        apiUrl: dto.apiUrl,
        httpMethod: dto.httpMethod,
        responseTime: dto.responseTime,
        statusCode: dto.statusCode,
        userAgent: dto.deviceInfo?.userAgent,
        platform: dto.deviceInfo?.platform,
        browser: dto.deviceInfo?.browser,
        browserVersion: dto.deviceInfo?.browserVersion,
        screenResolution: dto.deviceInfo?.screenResolution,
        language: dto.deviceInfo?.language,
        timezone: dto.deviceInfo?.timezone,
        ipAddress: dto.locationInfo?.ipAddress,
        country: dto.locationInfo?.country,
        region: dto.locationInfo?.region,
        city: dto.locationInfo?.city,
        sessionId: dto.sessionId,
        referrer: dto.referrer,
        errorMessage: dto.errorMessage,
        errorStack: dto.errorStack,
        tags: dto.tags || [],
        customData: dto.customData || {},
      };

      // 优先存入Redis队列
      try {
        await this.redis.lpush(
          this.USER_EVENT_QUEUE_KEY,
          JSON.stringify(eventData),
        );
        this.logger.debug(`用户事件已存入Redis队列: ${dto.eventType}`);

        // 返回一个模拟的UserEvent对象（实际上还未保存到数据库）
        return {
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...eventData,
        } as UserEvent;
      } catch (redisError) {
        // Redis失败时直接存入数据库
        this.logger.warn('Redis存储失败，直接存入数据库:', redisError);
        return await this.prisma.userEvent.create({
          data: eventData,
        });
      }
    } catch (error) {
      this.logger.error(`创建用户事件失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 批量创建用户事件
   */
  async createBatchEvents(
    dto: BatchCreateUserEventDto,
  ): Promise<{ count: number }> {
    try {
      const events = dto.events.map((event) => ({
        userId: event.userId,
        userName: event.userName,
        eventType: event.eventType,
        eventData: event.eventData || {},
        pagePath: event.pagePath,
        pageTitle: event.pageTitle,
        duration: event.duration,
        elementId: event.elementId,
        elementType: event.elementType?.toString(),
        elementText: event.elementText,
        apiUrl: event.apiUrl,
        httpMethod: event.httpMethod,
        responseTime: event.responseTime,
        statusCode: event.statusCode,
        userAgent: event.deviceInfo?.userAgent,
        platform: event.deviceInfo?.platform,
        browser: event.deviceInfo?.browser,
        browserVersion: event.deviceInfo?.browserVersion,
        screenResolution: event.deviceInfo?.screenResolution,
        language: event.deviceInfo?.language,
        timezone: event.deviceInfo?.timezone,
        ipAddress: event.locationInfo?.ipAddress,
        country: event.locationInfo?.country,
        region: event.locationInfo?.region,
        city: event.locationInfo?.city,
        sessionId: event.sessionId,
        referrer: event.referrer,
        errorMessage: event.errorMessage,
        errorStack: event.errorStack,
        tags: event.tags || [],
        customData: event.customData || {},
      }));

      const result = await this.prisma.userEvent.createMany({
        data: events,
      });

      return { count: result.count };
    } catch (error) {
      this.logger.error(`批量创建用户事件失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 查询用户事件列表
   */
  async findEvents(query: UserEventQueryDto) {
    try {
      const where: Prisma.UserEventWhereInput = {};

      if (query.userId) {
        where.userId = query.userId;
      }

      if (query.eventType) {
        where.eventType = query.eventType;
      }

      if (query.pagePath) {
        where.pagePath = {
          contains: query.pagePath,
          mode: 'insensitive',
        };
      }

      if (query.sessionId) {
        where.sessionId = query.sessionId;
      }

      if (query.startTime || query.endTime) {
        where.createdAt = {};
        if (query.startTime) {
          where.createdAt.gte = new Date(query.startTime);
        }
        if (query.endTime) {
          where.createdAt.lte = new Date(query.endTime);
        }
      }

      const skip = (query.page - 1) * query.pageSize;

      const [events, total] = await this.prisma.$transaction([
        this.prisma.userEvent.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: query.pageSize,
        }),
        this.prisma.userEvent.count({ where }),
      ]);

      return {
        data: events,
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize),
      };
    } catch (error) {
      this.logger.error(`查询用户事件失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取用户事件统计
   */
  async getEventStats(query: UserEventStatsDto) {
    try {
      const where: Prisma.UserEventWhereInput = {};

      if (query.userId) {
        where.userId = query.userId;
      }

      if (query.startTime || query.endTime) {
        where.createdAt = {};
        if (query.startTime) {
          where.createdAt.gte = new Date(query.startTime);
        }
        if (query.endTime) {
          where.createdAt.lte = new Date(query.endTime);
        }
      }

      // 按事件类型统计
      const eventTypeStats = await this.prisma.userEvent.groupBy({
        by: ['eventType'],
        where,
        _count: true,
      });

      // 按页面统计
      const pageStats = await this.prisma.userEvent.groupBy({
        by: ['pagePath'],
        where: {
          ...where,
          pagePath: {
            not: null,
          },
        },
        _count: true,
        orderBy: {
          _count: {
            pagePath: 'desc',
          },
        },
        take: 10,
      });

      // 按浏览器统计
      const browserStats = await this.prisma.userEvent.groupBy({
        by: ['browser'],
        where: {
          ...where,
          browser: {
            not: null,
          },
        },
        _count: true,
      });

      // 按操作系统统计
      const platformStats = await this.prisma.userEvent.groupBy({
        by: ['platform'],
        where: {
          ...where,
          platform: {
            not: null,
          },
        },
        _count: true,
      });

      // 时间趋势统计（简化版，实际应用中可能需要更复杂的SQL）
      const totalEvents = await this.prisma.userEvent.count({ where });
      const uniqueUsers = await this.prisma.userEvent.findMany({
        where,
        select: { userId: true },
        distinct: ['userId'],
      });

      return {
        summary: {
          totalEvents,
          uniqueUsers: uniqueUsers.length,
        },
        eventTypeStats: eventTypeStats.map((stat) => ({
          eventType: stat.eventType,
          count: stat._count,
        })),
        pageStats: pageStats.map((stat) => ({
          pagePath: stat.pagePath,
          count: stat._count,
        })),
        browserStats: browserStats.map((stat) => ({
          browser: stat.browser,
          count: stat._count,
        })),
        platformStats: platformStats.map((stat) => ({
          platform: stat.platform,
          count: stat._count,
        })),
      };
    } catch (error) {
      this.logger.error(`获取用户事件统计失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取用户会话分析
   */
  async getUserSessionAnalysis(userId: string, sessionId?: string) {
    try {
      const where: Prisma.UserEventWhereInput = { userId };
      if (sessionId) {
        where.sessionId = sessionId;
      }

      const events = await this.prisma.userEvent.findMany({
        where,
        orderBy: { createdAt: 'asc' },
      });

      if (events.length === 0) {
        return {
          totalEvents: 0,
          sessions: [],
        };
      }

      // 按会话分组
      const sessionMap = new Map();
      events.forEach((event) => {
        const sid = event.sessionId || 'unknown';
        if (!sessionMap.has(sid)) {
          sessionMap.set(sid, []);
        }
        sessionMap.get(sid).push(event);
      });

      const sessions = Array.from(sessionMap.entries()).map(
        ([sessionId, sessionEvents]) => {
          const firstEvent = sessionEvents[0];
          const lastEvent = sessionEvents[sessionEvents.length - 1];
          const sessionDuration =
            new Date(lastEvent.createdAt).getTime() -
            new Date(firstEvent.createdAt).getTime();

          const pageViews = sessionEvents.filter(
            (e) => e.eventType === EventType.PAGE_VIEW,
          );
          const uniquePages = new Set(
            pageViews.map((e) => e.pagePath).filter(Boolean),
          );

          return {
            sessionId,
            startTime: firstEvent.createdAt,
            endTime: lastEvent.createdAt,
            duration: sessionDuration,
            eventCount: sessionEvents.length,
            pageViewCount: pageViews.length,
            uniquePageCount: uniquePages.size,
            events: sessionEvents,
          };
        },
      );

      return {
        totalEvents: events.length,
        sessionCount: sessions.length,
        sessions: sessions.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
        ),
      };
    } catch (error) {
      this.logger.error(`获取用户会话分析失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取页面性能统计
   */
  async getPagePerformanceStats(pagePath?: string) {
    try {
      const where: Prisma.UserEventWhereInput = {
        eventType: EventType.PAGE_VIEW,
        duration: {
          not: null,
          gt: 0,
        },
      };

      if (pagePath) {
        where.pagePath = pagePath;
      }

      const pageViews = await this.prisma.userEvent.findMany({
        where,
        select: {
          pagePath: true,
          duration: true,
        },
      });

      // 按页面分组统计
      const pageStats = new Map();
      pageViews.forEach((pv) => {
        const path = pv.pagePath || 'unknown';
        if (!pageStats.has(path)) {
          pageStats.set(path, []);
        }
        pageStats.get(path).push(pv.duration);
      });

      const result = Array.from(pageStats.entries()).map(
        ([path, durations]) => {
          durations.sort((a, b) => a - b);
          const len = durations.length;
          const sum = durations.reduce((acc, d) => acc + d, 0);

          return {
            pagePath: path,
            viewCount: len,
            avgDuration: Math.round(sum / len),
            minDuration: durations[0],
            maxDuration: durations[len - 1],
            medianDuration:
              len % 2 === 0
                ? Math.round((durations[len / 2 - 1] + durations[len / 2]) / 2)
                : durations[Math.floor(len / 2)],
          };
        },
      );

      return result.sort((a, b) => b.viewCount - a.viewCount);
    } catch (error) {
      this.logger.error(`获取页面性能统计失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 删除过期的事件数据
   */
  async cleanupOldEvents(
    daysToKeep: number = 90,
  ): Promise<{ deletedCount: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.prisma.userEvent.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(
        `清理了 ${result.count} 条过期事件数据（保留 ${daysToKeep} 天）`,
      );
      return { deletedCount: result.count };
    } catch (error) {
      this.logger.error(`清理过期事件数据失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
