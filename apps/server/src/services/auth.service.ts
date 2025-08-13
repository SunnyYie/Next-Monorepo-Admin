import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../services/prisma.service';
import { LoginDto, RegisterDto, UpdateUserDto } from '../dto/auth.dto';
import { RoleType } from '../../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: {
                      include: {
                        children: {
                          orderBy: { order: 'asc' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 获取用户的所有权限路由
    const allPermissions = user.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map((rp) => rp.permission),
    );

    // 去重权限
    const uniquePermissions = allPermissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id),
    );

    // 获取扁平化权限数组
    const flattenPermissions = uniquePermissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
      label: permission.label,
      type: permission.type,
      route: permission.route,
      order: permission.order,
      icon: permission.icon,
      component: permission.component,
      hideInMenu: permission.hideInMenu,
      hide: permission.hide,
      parentId: permission.parentId,
    }));

    // 获取层级权限结构（只包含父级权限，children 已通过 Prisma 关联自动包含）
    const permissions = uniquePermissions
      .filter((permission) => !permission.parentId) // 只取父级权限
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // 按 order 排序

    const payload = { email: user.email, sub: user.id, role: user.roleName };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roleName: user.roleName,
        roles: user.userRoles.map((ur) => ur.role),
        flattenPermissions,
        permissions,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // 检查邮箱是否已存在
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('邮箱已被注册');
    }

    // 检查手机号是否已存在
    const existingUserByPhone = await this.prisma.user.findUnique({
      where: { phone: registerDto.phone },
    });

    if (existingUserByPhone) {
      throw new ConflictException('手机号已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        password: hashedPassword,
        name: registerDto.name,
        avatar: registerDto.avatar,
        roleName: registerDto.roleName || RoleType.USER,
      },
    });

    // 为用户分配默认角色
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: user.roleName },
    });

    if (defaultRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
        },
      });
    }

    const { password: _, ...result } = user;
    return result;
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        roleName: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        roleName: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 检查邮箱是否被其他用户使用
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: updateUserDto.email, NOT: { id } },
      });
      if (existingUser) {
        throw new ConflictException('邮箱已被其他用户使用');
      }
    }

    // 检查手机号是否被其他用户使用
    if (updateUserDto.phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: { phone: updateUserDto.phone, NOT: { id } },
      });
      if (existingUser) {
        throw new ConflictException('手机号已被其他用户使用');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        avatar: true,
        roleName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: '用户删除成功' };
  }
}
