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
  ApiBody,
} from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, PermissionsGuard } from '../auth/roles.guard';
import { Roles, Permissions } from '../auth/decorators';
import { RoleType } from '../../generated/prisma';

@ApiTags('角色管理')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:create')
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 409, description: '角色已存在' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:read')
  @ApiOperation({ summary: '获取所有角色' })
  @ApiResponse({ status: 200, description: '获取成功' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:read')
  @ApiOperation({ summary: '根据ID获取角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:update')
  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:delete')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Put(':id/permissions')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  @Permissions('role:update')
  @ApiOperation({ summary: '为角色分配权限' })
  @ApiParam({ name: 'id', description: '角色ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: {
          type: 'array',
          items: { type: 'string' },
          description: '权限ID数组',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: '分配成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  assignPermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] },
  ) {
    return this.roleService.assignPermissions(id, body.permissionIds);
  }
}
