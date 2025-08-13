import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator';
import { PermissionType, RoleType } from '../../generated/prisma';

export class CreatePermissionRouteDto {
  @ApiProperty({ description: '权限名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '权限标签' })
  @IsString()
  label: string;

  @ApiProperty({ description: '权限类型', enum: PermissionType })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({ description: '路由地址' })
  @IsString()
  route: string;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '组件', required: false })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiProperty({ description: '在菜单中隐藏', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  hideInMenu?: boolean;

  @ApiProperty({ description: '隐藏', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  hide?: boolean;

  @ApiProperty({ description: '关联角色', enum: RoleType, isArray: true })
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roleName: RoleType[];

  @ApiProperty({ description: '父级权限ID', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdatePermissionRouteDto {
  @ApiProperty({ description: '权限名称', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '权限标签', required: false })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: '权限类型',
    enum: PermissionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PermissionType)
  type?: PermissionType;

  @ApiProperty({ description: '路由地址', required: false })
  @IsOptional()
  @IsString()
  route?: string;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '组件', required: false })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiProperty({ description: '在菜单中隐藏', required: false })
  @IsOptional()
  @IsBoolean()
  hideInMenu?: boolean;

  @ApiProperty({ description: '隐藏', required: false })
  @IsOptional()
  @IsBoolean()
  hide?: boolean;

  @ApiProperty({
    description: '关联角色',
    enum: RoleType,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roleName?: RoleType[];

  @ApiProperty({ description: '父级权限ID', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}
