import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, UpdateUserDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, PermissionsGuard } from '../auth/roles.guard';
import { Roles, Permissions } from '../auth/decorators';
import { RoleType } from '../../generated/prisma';
import { ApiSuccessResponse, ApiErrorResponse } from '../common';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiSuccessResponse(200, '登录成功', {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 'user-id',
      email: 'user@example.com',
      name: '用户名',
      avatar: 'avatar-url',
      roleName: 'USER',
      roles: [],
      flattenPermissions: [],
      permissions: [],
    },
  })
  @ApiErrorResponse(401, '邮箱或密码错误')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiSuccessResponse(201, '注册成功', {
    id: 'user-id',
    email: 'user@example.com',
    name: '用户名',
    phone: '13800138000',
    roleName: 'USER',
  })
  @ApiErrorResponse(409, '邮箱已被注册')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiSuccessResponse(200, '获取成功', {
    id: 'user-id',
    email: 'user@example.com',
    name: '用户名',
    avatar: 'avatar-url',
    roleName: 'USER',
  })
  getProfile(@Request() req) {
    return req.user;
  }
}

@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  // @Permissions('user:read')
  @ApiOperation({ summary: '获取所有用户' })
  @ApiSuccessResponse(200, '获取成功', [
    {
      id: 'user-id',
      email: 'user@example.com',
      name: '用户名',
      phone: '13800138000',
      roleName: 'USER',
    },
  ])
  findAll() {
    return this.authService.findAllUsers();
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  // @Permissions('user:read')
  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  // @Permissions('user:update')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('user:delete')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
