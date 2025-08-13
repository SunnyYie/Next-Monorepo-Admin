import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  CreatePermissionRouteDto,
  UpdatePermissionRouteDto,
} from '../dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionRouteDto) {
    // 检查路由是否已存在
    const existingRoute = await this.prisma.userPermissionRoutes.findUnique({
      where: { route: createPermissionDto.route },
    });

    if (existingRoute) {
      throw new ConflictException('路由已存在');
    }

    // 如果有父级权限，检查父级是否存在
    if (createPermissionDto.parentId) {
      const parentPermission =
        await this.prisma.userPermissionRoutes.findUnique({
          where: { id: createPermissionDto.parentId },
        });

      if (!parentPermission) {
        throw new NotFoundException('父级权限不存在');
      }
    }

    return this.prisma.userPermissionRoutes.create({
      data: createPermissionDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAll() {
    return this.prisma.userPermissionRoutes.findMany({
      include: {
        parent: true,
        children: true,
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const permission = await this.prisma.userPermissionRoutes.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        rolePermissions: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('权限路由不存在');
    }

    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionRouteDto) {
    const permission = await this.prisma.userPermissionRoutes.findUnique({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('权限路由不存在');
    }

    // 检查路由是否被其他权限使用
    if (updatePermissionDto.route) {
      const existingRoute = await this.prisma.userPermissionRoutes.findFirst({
        where: { route: updatePermissionDto.route, NOT: { id } },
      });
      if (existingRoute) {
        throw new ConflictException('路由已被其他权限使用');
      }
    }

    // 如果有父级权限，检查父级是否存在
    if (updatePermissionDto.parentId) {
      const parentPermission =
        await this.prisma.userPermissionRoutes.findUnique({
          where: { id: updatePermissionDto.parentId },
        });

      if (!parentPermission) {
        throw new NotFoundException('父级权限不存在');
      }
    }

    return this.prisma.userPermissionRoutes.update({
      where: { id },
      data: updatePermissionDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string) {
    const permission = await this.prisma.userPermissionRoutes.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (!permission) {
      throw new NotFoundException('权限路由不存在');
    }

    // 如果有子权限，不允许删除
    if (permission.children.length > 0) {
      throw new ConflictException('存在子权限，无法删除');
    }

    await this.prisma.userPermissionRoutes.delete({ where: { id } });
    return { message: '权限路由删除成功' };
  }

  async getPermissionTree() {
    const permissions = await this.prisma.userPermissionRoutes.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
      where: {
        parentId: null,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    return permissions;
  }

  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const permissions = user.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map((rp) => rp.permission),
    );

    // 去重
    const uniquePermissions = permissions.filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id),
    );

    return uniquePermissions;
  }
}
