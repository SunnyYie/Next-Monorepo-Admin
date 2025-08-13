import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionService } from '../services/permission.service';
import {
  CreatePermissionRouteDto,
  UpdatePermissionRouteDto,
} from '../dto/permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, PermissionsGuard } from '../auth/roles.guard';
import { Roles, Permissions } from '../auth/decorators';
import { RoleType } from '../../generated/prisma';

@ApiTags('权限路由管理')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:create')
  @ApiOperation({ summary: '创建权限路由' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '路由已存在' })
  create(@Body() createPermissionDto: CreatePermissionRouteDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:read')
  @ApiOperation({ summary: '获取所有权限路由' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('tree')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:read')
  @ApiOperation({ summary: '获取权限路由树形结构' })
  @ApiResponse({ status: 200, description: '获取成功' })
  getPermissionTree() {
    return this.permissionService.getPermissionTree();
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户权限路由' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  getUserPermissions(@Param('userId') userId: string) {
    return this.permissionService.getUserPermissions(userId);
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:read')
  @ApiOperation({ summary: '根据ID获取权限路由' })
  @ApiParam({ name: 'id', description: '权限路由ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '权限路由不存在' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:update')
  @ApiOperation({ summary: '更新权限路由' })
  @ApiParam({ name: 'id', description: '权限路由ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '权限路由不存在' })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionRouteDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('permission:delete')
  @ApiOperation({ summary: '删除权限路由' })
  @ApiParam({ name: 'id', description: '权限路由ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '权限路由不存在' })
  @ApiResponse({ status: 409, description: '存在子权限，无法删除' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
