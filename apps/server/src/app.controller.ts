import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './services/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    redis: string;
  }> {
    let redisStatus = 'connected';

    try {
      // 尝试ping Redis
      await this.redisService.set('health_check', 'ping', 10);
      await this.redisService.get('health_check');
    } catch (error) {
      redisStatus = 'disconnected';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      redis: redisStatus,
    };
  }
}
