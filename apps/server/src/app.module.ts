import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { AuthController, UserController } from './controllers/auth.controller';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard, PermissionsGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    RoleService,
    PermissionService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class AppModule {}
