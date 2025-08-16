import { PrismaClient } from '../generated/prisma';
import { Logger } from '@nestjs/common';

/**
 * 岗位数据清理脚本
 * 用于清理超过指定时间的岗位数据
 */
class JobDataCleanupScript {
  private prisma: PrismaClient;
  private logger = new Logger('JobDataCleanupScript');

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 清理超过指定小时数的岗位数据
   * @param hoursAgo 清理多少小时前的数据，默认48小时
   * @param dryRun 是否只是预览，不实际删除，默认false
   */
  async cleanupJobData(
    hoursAgo: number = 48,
    dryRun: boolean = false,
  ): Promise<void> {
    try {
      this.logger.log(`开始清理${hoursAgo}小时前的岗位数据...`);

      // 计算截止时间
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursAgo);

      this.logger.log(`截止时间: ${cutoffDate.toISOString()}`);

      // 查询需要清理的数据
      const jobsToDelete = await this.prisma.jobInfo.findMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
        select: {
          id: true,
          jobName: true,
          brandName: true,
          createdAt: true,
        },
      });

      this.logger.log(`找到 ${jobsToDelete.length} 条需要清理的岗位数据`);

      if (jobsToDelete.length === 0) {
        this.logger.log('没有需要清理的数据');
        return;
      }

      // 显示将要删除的数据概览
      if (dryRun) {
        this.logger.log('=== 预览模式 - 以下数据将被删除 ===');
        jobsToDelete.slice(0, 10).forEach((job, index) => {
          this.logger.log(
            `${index + 1}. ${job.jobName} - ${job.brandName} (${job.createdAt.toISOString()})`,
          );
        });
        if (jobsToDelete.length > 10) {
          this.logger.log(`... 还有 ${jobsToDelete.length - 10} 条数据`);
        }
        this.logger.log('=== 预览结束 ===');
        return;
      }

      // 执行批量删除
      const result = await this.prisma.jobInfo.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(`成功清理了 ${result.count} 条岗位数据`);

      // 统计清理后的数据概况
      const remainingCount = await this.prisma.jobInfo.count();
      this.logger.log(`剩余岗位数据: ${remainingCount} 条`);
    } catch (error) {
      this.logger.error('清理岗位数据时发生错误:', error);
      throw error;
    }
  }

  /**
   * 清理指定日期之前的数据
   * @param beforeDate 清理此日期之前的数据
   * @param dryRun 是否只是预览，不实际删除
   */
  async cleanupJobDataBeforeDate(
    beforeDate: Date,
    dryRun: boolean = false,
  ): Promise<void> {
    try {
      this.logger.log(`开始清理 ${beforeDate.toISOString()} 之前的岗位数据...`);

      const jobsToDelete = await this.prisma.jobInfo.findMany({
        where: {
          createdAt: {
            lt: beforeDate,
          },
        },
        select: {
          id: true,
          jobName: true,
          brandName: true,
          createdAt: true,
        },
      });

      this.logger.log(`找到 ${jobsToDelete.length} 条需要清理的岗位数据`);

      if (jobsToDelete.length === 0) {
        this.logger.log('没有需要清理的数据');
        return;
      }

      if (dryRun) {
        this.logger.log('=== 预览模式 - 以下数据将被删除 ===');
        jobsToDelete.slice(0, 10).forEach((job, index) => {
          this.logger.log(
            `${index + 1}. ${job.jobName} - ${job.brandName} (${job.createdAt.toISOString()})`,
          );
        });
        if (jobsToDelete.length > 10) {
          this.logger.log(`... 还有 ${jobsToDelete.length - 10} 条数据`);
        }
        this.logger.log('=== 预览结束 ===');
        return;
      }

      const result = await this.prisma.jobInfo.deleteMany({
        where: {
          createdAt: {
            lt: beforeDate,
          },
        },
      });

      this.logger.log(`成功清理了 ${result.count} 条岗位数据`);

      const remainingCount = await this.prisma.jobInfo.count();
      this.logger.log(`剩余岗位数据: ${remainingCount} 条`);
    } catch (error) {
      this.logger.error('清理岗位数据时发生错误:', error);
      throw error;
    }
  }

  /**
   * 清理不活跃的岗位数据
   * @param hoursAgo 清理多少小时前的数据
   * @param dryRun 是否只是预览，不实际删除
   */
  async cleanupInactiveJobData(
    hoursAgo: number = 48,
    dryRun: boolean = false,
  ): Promise<void> {
    try {
      this.logger.log(`开始清理${hoursAgo}小时前的不活跃岗位数据...`);

      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hoursAgo);

      const jobsToDelete = await this.prisma.jobInfo.findMany({
        where: {
          AND: [
            {
              createdAt: {
                lt: cutoffDate,
              },
            },
            {
              isActive: false,
            },
          ],
        },
        select: {
          id: true,
          jobName: true,
          brandName: true,
          createdAt: true,
          isActive: true,
        },
      });

      this.logger.log(`找到 ${jobsToDelete.length} 条需要清理的不活跃岗位数据`);

      if (jobsToDelete.length === 0) {
        this.logger.log('没有需要清理的不活跃数据');
        return;
      }

      if (dryRun) {
        this.logger.log('=== 预览模式 - 以下不活跃数据将被删除 ===');
        jobsToDelete.slice(0, 10).forEach((job, index) => {
          this.logger.log(
            `${index + 1}. ${job.jobName} - ${job.brandName} (活跃: ${job.isActive}, 创建时间: ${job.createdAt.toISOString()})`,
          );
        });
        if (jobsToDelete.length > 10) {
          this.logger.log(`... 还有 ${jobsToDelete.length - 10} 条数据`);
        }
        this.logger.log('=== 预览结束 ===');
        return;
      }

      const result = await this.prisma.jobInfo.deleteMany({
        where: {
          AND: [
            {
              createdAt: {
                lt: cutoffDate,
              },
            },
            {
              isActive: false,
            },
          ],
        },
      });

      this.logger.log(`成功清理了 ${result.count} 条不活跃岗位数据`);

      const remainingCount = await this.prisma.jobInfo.count();
      const activeCount = await this.prisma.jobInfo.count({
        where: { isActive: true },
      });
      this.logger.log(
        `剩余岗位数据: ${remainingCount} 条（活跃: ${activeCount} 条）`,
      );
    } catch (error) {
      this.logger.error('清理不活跃岗位数据时发生错误:', error);
      throw error;
    }
  }

  /**
   * 获取数据库统计信息
   */
  async getStatistics(): Promise<void> {
    try {
      const totalCount = await this.prisma.jobInfo.count();
      const activeCount = await this.prisma.jobInfo.count({
        where: { isActive: true },
      });
      const inactiveCount = totalCount - activeCount;

      // 获取最早和最新的数据时间
      const oldestJob = await this.prisma.jobInfo.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      });

      const newestJob = await this.prisma.jobInfo.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      // 统计48小时前的数据量
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - 48);
      const oldDataCount = await this.prisma.jobInfo.count({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log('=== 岗位数据统计 ===');
      this.logger.log(`总数据量: ${totalCount} 条`);
      this.logger.log(`活跃数据: ${activeCount} 条`);
      this.logger.log(`不活跃数据: ${inactiveCount} 条`);
      this.logger.log(`48小时前的数据: ${oldDataCount} 条`);

      if (oldestJob) {
        this.logger.log(`最早数据时间: ${oldestJob.createdAt.toISOString()}`);
      }

      if (newestJob) {
        this.logger.log(`最新数据时间: ${newestJob.createdAt.toISOString()}`);
      }

      this.logger.log('=== 统计结束 ===');
    } catch (error) {
      this.logger.error('获取统计信息时发生错误:', error);
      throw error;
    }
  }

  /**
   * 关闭数据库连接
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// 主函数
async function main() {
  const script = new JobDataCleanupScript();

  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    const hoursArg = args.find((arg) => arg.startsWith('--hours='));
    const dryRunArg = args.includes('--dry-run');
    const statsArg = args.includes('--stats');
    const inactiveOnlyArg = args.includes('--inactive-only');
    const helpArg = args.includes('--help') || args.includes('-h');

    if (helpArg) {
      console.log(`
岗位数据清理脚本使用说明:

基本用法:
  npm run cleanup-jobs                    # 清理48小时前的所有岗位数据
  npm run cleanup-jobs -- --hours=72     # 清理72小时前的所有岗位数据
  npm run cleanup-jobs -- --dry-run      # 预览模式，不实际删除数据
  npm run cleanup-jobs -- --inactive-only # 只清理不活跃的岗位数据
  npm run cleanup-jobs -- --stats        # 显示数据库统计信息

参数说明:
  --hours=N          指定清理N小时前的数据（默认48小时）
  --dry-run          预览模式，显示将要删除的数据但不实际删除
  --inactive-only    只清理不活跃（isActive=false）的数据
  --stats            显示数据库统计信息
  --help, -h         显示此帮助信息

示例:
  npm run cleanup-jobs -- --hours=24 --dry-run  # 预览24小时前的数据
  npm run cleanup-jobs -- --hours=72 --inactive-only  # 清理72小时前的不活跃数据
      `);
      return;
    }

    // 显示统计信息
    if (statsArg) {
      await script.getStatistics();
      return;
    }

    const hours = hoursArg ? parseInt(hoursArg.split('=')[1]) : 48;

    // 显示配置信息
    console.log(`配置信息:`);
    console.log(`- 清理时间: ${hours} 小时前`);
    console.log(`- 预览模式: ${dryRunArg ? '是' : '否'}`);
    console.log(`- 仅清理不活跃数据: ${inactiveOnlyArg ? '是' : '否'}`);
    console.log('');

    // 首先显示统计信息
    await script.getStatistics();
    console.log('');

    // 执行清理
    if (inactiveOnlyArg) {
      await script.cleanupInactiveJobData(hours, dryRunArg);
    } else {
      await script.cleanupJobData(hours, dryRunArg);
    }
  } catch (error) {
    console.error('脚本执行失败:', error);
    process.exit(1);
  } finally {
    await script.disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

export { JobDataCleanupScript };
