import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis.service';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { UserEventService } from './services/user-event.service';
import { JobInfoService } from './services/job-info.service';
import { JobCleanupSchedulerService } from './services/job-cleanup-scheduler.service';
import { AuthController, UserController } from './controllers/auth.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { UserEventController } from './controllers/user-event.controller';
import { RedisController } from './controllers/redis.controller';
import { JobInfoController } from './controllers/job-info.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard, PermissionsGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(), // 启用定时任务
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    RoleController,
    PermissionController,
    UserEventController,
    RedisController,
    JobInfoController,
  ],
  providers: [
    AppService,
    PrismaService,
    RedisService,
    AuthService,
    RoleService,
    PermissionService,
    UserEventService,
    JobInfoService,
    JobCleanupSchedulerService, // 添加定时任务服务
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class AppModule {}
