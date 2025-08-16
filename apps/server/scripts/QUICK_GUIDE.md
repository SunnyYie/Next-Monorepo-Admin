# 定时任务快速使用指南

## 🚀 快速开始

### 1. 启用定时任务

确保在 `app.module.ts` 中已经导入了 `ScheduleModule`：

```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 启用定时任务
    // ...
  ],
})
export class AppModule {}
```

### 2. 已配置的自动任务

系统已自动配置以下定时清理任务：

- ⏰ **每日清理** - 每天凌晨2点，清理48小时前的不活跃数据
- 🗂️ **每周深度清理** - 每周日凌晨3点，清理7天前的所有数据

### 3. 手动执行清理

#### 通过脚本执行

```bash
# 进入server目录
cd apps/server

# 查看统计信息
npx ts-node scripts/cleanup-job-data.ts -- --stats

# 预览48小时前的数据（不删除）
npx ts-node scripts/cleanup-job-data.ts -- --dry-run

# 清理48小时前的不活跃数据
npx ts-node scripts/cleanup-job-data.ts -- --inactive-only

# 清理72小时前的所有数据
npx ts-node scripts/cleanup-job-data.ts -- --hours=72
```

#### 通过API接口

```bash
# 获取统计信息
GET /job-info/stats/expiring?hours=48

# 清理不活跃数据
DELETE /job-info/cleanup/inactive-expired?hours=48

# 清理所有过期数据
DELETE /job-info/cleanup/expired?hours=72
```

## 📊 常用命令

| 功能           | 命令                                                         |
| -------------- | ------------------------------------------------------------ |
| 查看帮助       | `npx ts-node scripts/cleanup-job-data.ts -- --help`          |
| 查看统计       | `npx ts-node scripts/cleanup-job-data.ts -- --stats`         |
| 预览清理       | `npx ts-node scripts/cleanup-job-data.ts -- --dry-run`       |
| 清理不活跃数据 | `npx ts-node scripts/cleanup-job-data.ts -- --inactive-only` |
| 自定义时间清理 | `npx ts-node scripts/cleanup-job-data.ts -- --hours=72`      |

## ⚠️ 注意事项

1. **数据安全**: 建议先使用 `--dry-run` 预览要删除的数据
2. **执行时间**: 清理任务建议在业务低峰期执行
3. **监控**: 定期检查定时任务的执行状态和日志
4. **备份**: 执行大规模清理前建议备份重要数据

## 🔍 监控和日志

- 定时任务执行日志会显示在应用控制台
- 可以通过API获取数据库统计信息
- 建议设置数据库存储空间监控告警

## 📞 支持

如有问题，请查看详细文档 `README.md` 或联系开发团队。
