import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { RoleType } from '../../generated/prisma';

export class LoginDto {
  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ description: '邮箱', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: '角色类型',
    enum: RoleType,
    default: RoleType.USER,
  })
  @IsEnum(RoleType)
  @IsOptional()
  roleName?: RoleType;
}

export class UpdateUserDto {
  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '手机号', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '角色类型', enum: RoleType, required: false })
  @IsEnum(RoleType)
  @IsOptional()
  roleName?: RoleType;
}
