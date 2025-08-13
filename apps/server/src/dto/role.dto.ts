import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { RoleType } from '../../generated/prisma';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称', enum: RoleType })
  @IsEnum(RoleType)
  name: RoleType;

  @ApiProperty({ description: '角色描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @ApiProperty({ description: '角色描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
