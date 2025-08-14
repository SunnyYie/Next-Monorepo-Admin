import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RedisService } from '../services/redis.service';
import { UserEventService } from '../services/user-event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators';
import { RoleType } from '../../generated/prisma';

@ApiTags('Redis管理')
@Controller('redis')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@ApiBearerAuth()
export class RedisController {
  private readonly USER_EVENT_QUEUE_KEY = 'user_events_queue';

  constructor(
    private readonly redisService: RedisService,
    private readonly userEventService: UserEventService,
  ) {}

  @Get('queue-status')
  @ApiOperation({ summary: '获取用户事件队列状态' })
  @ApiResponse({ status: 200, description: '队列状态信息' })
  async getQueueStatus() {
    try {
      const queueLength = await this.redisService.llen(
        this.USER_EVENT_QUEUE_KEY,
      );

      return {
        queueKey: this.USER_EVENT_QUEUE_KEY,
        queueLength,
        status: queueLength > 0 ? 'active' : 'empty',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        queueKey: this.USER_EVENT_QUEUE_KEY,
        queueLength: 0,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('queue-preview')
  @ApiOperation({ summary: '预览队列中的事件（不删除）' })
  @ApiResponse({ status: 200, description: '队列预览数据' })
  async previewQueue(@Query('limit') limit: string = '10') {
    try {
      const limitNum = Math.min(parseInt(limit) || 10, 50); // 最多预览50条
      const events = await this.redisService.lrange(
        this.USER_EVENT_QUEUE_KEY,
        0,
        limitNum - 1,
      );

      const parsedEvents = events.map((eventStr, index) => {
        try {
          return {
            index,
            data: JSON.parse(eventStr),
          };
        } catch (error) {
          return {
            index,
            error: 'Invalid JSON',
            raw: eventStr,
          };
        }
      });

      return {
        queueKey: this.USER_EVENT_QUEUE_KEY,
        totalInQueue: await this.redisService.llen(this.USER_EVENT_QUEUE_KEY),
        previewCount: parsedEvents.length,
        events: parsedEvents,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('process-queue')
  @ApiOperation({ summary: '手动触发队列处理' })
  @ApiResponse({ status: 200, description: '处理结果' })
  async processQueue() {
    try {
      const queueLength = await this.redisService.llen(
        this.USER_EVENT_QUEUE_KEY,
      );

      if (queueLength === 0) {
        return {
          message: '队列为空，无需处理',
          processed: 0,
          queueLength: 0,
          timestamp: new Date().toISOString(),
        };
      }

      // 调用UserEventService的公共方法进行批量处理
      const result = await this.userEventService.processBatchEvents();

      return {
        message: result.message,
        processed: result.processed,
        queueLengthBefore: queueLength,
        queueLengthAfter: await this.redisService.llen(
          this.USER_EVENT_QUEUE_KEY,
        ),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('stats')
  @ApiOperation({ summary: '获取Redis统计信息' })
  @ApiResponse({ status: 200, description: 'Redis统计信息' })
  async getRedisStats() {
    try {
      const queueLength = await this.redisService.llen(
        this.USER_EVENT_QUEUE_KEY,
      );

      // 检查连接状态
      let connectionStatus = 'connected';
      try {
        await this.redisService.set('ping_test', 'pong', 5);
        await this.redisService.get('ping_test');
      } catch (error) {
        connectionStatus = 'disconnected';
      }

      return {
        connection: connectionStatus,
        queues: {
          [this.USER_EVENT_QUEUE_KEY]: {
            length: queueLength,
            status: queueLength > 0 ? 'active' : 'empty',
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        connection: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
