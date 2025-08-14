import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.client = createClient({
        socket: {
          host: this.configService.get<string>(
            'REDIS_HOST',
            'redis-13544.crce178.ap-east-1-1.ec2.redns.redis-cloud.com',
          ),
          port: this.configService.get<number>('REDIS_PORT', 13544),
        },
        password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
        database: this.configService.get<number>('REDIS_DB', 0),
      });

      this.client.on('error', (err) => {
        this.logger.error('Redis连接错误:', err);
      });

      this.client.on('connect', () => {
        this.logger.log('Redis连接成功');
      });

      await this.client.connect();
    } catch (error) {
      this.logger.error('Redis初始化失败:', error);
      throw error;
    }
  }

  private async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.logger.log('Redis连接已断开');
    }
  }

  /**
   * 设置键值对
   */
  async set(key: string, value: string | object, ttl?: number): Promise<void> {
    try {
      const serializedValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error(`Redis设置键 ${key} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取值
   */
  async get(key: string): Promise<string | null> {
    try {
      const result = await this.client.get(key);
      return result as string | null;
    } catch (error) {
      this.logger.error(`Redis获取键 ${key} 失败:`, error);
      throw error;
    }
  }

  /**
   * 获取并解析JSON值
   */
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Redis获取JSON键 ${key} 失败:`, error);
      throw error;
    }
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(`Redis删除键 ${key} 失败:`, error);
      throw error;
    }
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis检查键 ${key} 是否存在失败:`, error);
      throw error;
    }
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis设置键 ${key} 过期时间失败:`, error);
      throw error;
    }
  }

  /**
   * 向列表推入元素
   */
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.lPush(key, values);
    } catch (error) {
      this.logger.error(`Redis向列表 ${key} 推入元素失败:`, error);
      throw error;
    }
  }

  /**
   * 从列表弹出元素
   */
  async rpop(key: string): Promise<string | null> {
    try {
      const result = await this.client.rPop(key);
      return result as string | null;
    } catch (error) {
      this.logger.error(`Redis从列表 ${key} 弹出元素失败:`, error);
      throw error;
    }
  }

  /**
   * 获取列表长度
   */
  async llen(key: string): Promise<number> {
    try {
      return await this.client.lLen(key);
    } catch (error) {
      this.logger.error(`Redis获取列表 ${key} 长度失败:`, error);
      throw error;
    }
  }

  /**
   * 获取列表范围内的元素
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.client.lRange(key, start, stop);
    } catch (error) {
      this.logger.error(`Redis获取列表 ${key} 范围元素失败:`, error);
      throw error;
    }
  }

  /**
   * 批量获取列表元素并删除
   */
  async lpopBatch(key: string, count: number): Promise<string[]> {
    try {
      const results: string[] = [];
      for (let i = 0; i < count; i++) {
        const item = await this.client.lPop(key);
        if (item === null) break;
        results.push(item as string);
      }
      return results;
    } catch (error) {
      this.logger.error(`Redis批量弹出列表 ${key} 元素失败:`, error);
      throw error;
    }
  }

  /**
   * 获取原始Redis客户端
   */
  getClient(): RedisClientType {
    return this.client;
  }
}
