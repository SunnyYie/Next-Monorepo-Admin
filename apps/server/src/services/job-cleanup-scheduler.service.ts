import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobInfoService } from './job-info.service';

@Injectable()
export class JobCleanupSchedulerService {
  private readonly logger = new Logger(JobCleanupSchedulerService.name);

  constructor(private readonly jobInfoService: JobInfoService) {}

  // 每天凌晨2点执行清理任务
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyCleanup() {
    this.logger.log('开始执行每日岗位数据清理任务...');

    try {
      // 清理48小时前的不活跃数据
      const result = await this.jobInfoService.cleanupInactiveExpiredJobs(48);
      this.logger.log(
        `每日清理完成: ${result.message}, 清理数量: ${result.count}`,
      );
    } catch (error) {
      this.logger.error('每日清理任务执行失败:', error);
    }
  }

  // 每周日凌晨3点执行深度清理任务
  @Cron(CronExpression.EVERY_WEEK)
  async handleWeeklyCleanup() {
    this.logger.log('开始执行每周岗位数据深度清理任务...');

    try {
      // 清理7天前的所有数据
      const result = await this.jobInfoService.cleanupExpiredJobs(168); // 7 * 24 = 168小时
      this.logger.log(
        `每周深度清理完成: ${result.message}, 清理数量: ${result.count}`,
      );

      // 获取清理后的统计信息
      const stats = await this.jobInfoService.getExpiringJobsStats(48);
      this.logger.log(
        `清理后统计: 总数据 ${stats.stats.total} 条, 活跃数据 ${stats.stats.active} 条`,
      );
    } catch (error) {
      this.logger.error('每周深度清理任务执行失败:', error);
    }
  }

  // 手动触发清理任务
  async manualCleanup(
    hoursAgo: number = 48,
    cleanupType: 'all' | 'inactive' = 'inactive',
  ) {
    this.logger.log(
      `开始执行手动清理任务, 类型: ${cleanupType}, 时间: ${hoursAgo}小时前`,
    );

    try {
      let result;
      if (cleanupType === 'all') {
        result = await this.jobInfoService.cleanupExpiredJobs(hoursAgo);
      } else {
        result = await this.jobInfoService.cleanupInactiveExpiredJobs(hoursAgo);
      }

      this.logger.log(
        `手动清理完成: ${result.message}, 清理数量: ${result.count}`,
      );
      return result;
    } catch (error) {
      this.logger.error('手动清理任务执行失败:', error);
      throw error;
    }
  }
}
