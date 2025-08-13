import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // 检查角色是否已存在
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('角色已存在');
    }

    return this.prisma.role.create({
      data: createRoleDto,
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    await this.prisma.role.delete({ where: { id } });
    return { message: '角色删除成功' };
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 删除现有权限关联
    await this.prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // 创建新的权限关联
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.prisma.rolePermission.createMany({
      data: rolePermissions,
    });

    return { message: '权限分配成功' };
  }
}
