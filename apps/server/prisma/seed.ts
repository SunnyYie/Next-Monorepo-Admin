import { PrismaClient, RoleType, PermissionType } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据初始化...');

  // 1. 创建角色数据
  console.log('创建角色数据...');
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: RoleType.OWNER },
      update: {},
      create: {
        name: RoleType.OWNER,
        description: '系统拥有者，拥有所有权限',
      },
    }),
    prisma.role.upsert({
      where: { name: RoleType.ADMIN },
      update: {},
      create: {
        name: RoleType.ADMIN,
        description: '管理员，拥有大部分权限',
      },
    }),
    prisma.role.upsert({
      where: { name: RoleType.USER },
      update: {},
      create: {
        name: RoleType.USER,
        description: '普通用户，拥有基础权限',
      },
    }),
  ]);

  console.log(`✅ 创建了 ${roles.length} 个角色`);

  // 2. 创建权限路由数据
  console.log('创建权限路由数据...');

  // 创建父级菜单
  const dashboardRoute = await prisma.userPermissionRoutes.upsert({
    where: { route: '/dashboard' },
    update: {},
    create: {
      name: 'dashboard',
      label: '仪表盘',
      type: PermissionType.MENU,
      route: '/dashboard',
      order: 1,
      icon: 'dashboard',
      component: 'Dashboard',
      hideInMenu: false,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN, RoleType.USER],
    },
  });

  const userManagementRoute = await prisma.userPermissionRoutes.upsert({
    where: { route: '/user-management' },
    update: {},
    create: {
      name: 'user-management',
      label: '用户管理',
      type: PermissionType.MENU,
      route: '/user-management',
      order: 2,
      icon: 'users',
      component: 'UserManagement',
      hideInMenu: false,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN],
    },
  });

  const systemSettingsRoute = await prisma.userPermissionRoutes.upsert({
    where: { route: '/system-settings' },
    update: {},
    create: {
      name: 'system-settings',
      label: '系统设置',
      type: PermissionType.MENU,
      route: '/system-settings',
      order: 3,
      icon: 'settings',
      component: 'SystemSettings',
      hideInMenu: false,
      hide: false,
      roleName: [RoleType.OWNER],
    },
  });

  // 创建子级权限（按钮权限）
  const userReadButton = await prisma.userPermissionRoutes.upsert({
    where: { route: '/user-management/read' },
    update: {},
    create: {
      name: 'user:read',
      label: '查看用户',
      type: PermissionType.BUTTON,
      route: '/user-management/read',
      order: 1,
      icon: 'eye',
      parentId: userManagementRoute.id,
      hideInMenu: true,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN],
    },
  });

  const userUpdateButton = await prisma.userPermissionRoutes.upsert({
    where: { route: '/user-management/update' },
    update: {},
    create: {
      name: 'user:update',
      label: '更新用户',
      type: PermissionType.BUTTON,
      route: '/user-management/update',
      order: 2,
      icon: 'edit',
      parentId: userManagementRoute.id,
      hideInMenu: true,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN],
    },
  });

  const userCreateButton = await prisma.userPermissionRoutes.upsert({
    where: { route: '/user-management/create' },
    update: {},
    create: {
      name: 'user:create',
      label: '创建用户',
      type: PermissionType.BUTTON,
      route: '/user-management/create',
      order: 3,
      icon: 'plus',
      parentId: userManagementRoute.id,
      hideInMenu: true,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN],
    },
  });

  const userDeleteButton = await prisma.userPermissionRoutes.upsert({
    where: { route: '/user-management/delete' },
    update: {},
    create: {
      name: 'user:delete',
      label: '删除用户',
      type: PermissionType.BUTTON,
      route: '/user-management/delete',
      order: 4,
      icon: 'trash',
      parentId: userManagementRoute.id,
      hideInMenu: true,
      hide: false,
      roleName: [RoleType.OWNER, RoleType.ADMIN],
    },
  });

  const allRoutes = [
    dashboardRoute,
    userManagementRoute,
    systemSettingsRoute,
    userReadButton,
    userUpdateButton,
    userCreateButton,
    userDeleteButton,
  ];

  console.log(`✅ 创建了 ${allRoutes.length} 个权限路由`);

  // 3. 分配角色权限
  console.log('分配角色权限...');

  const ownerRole = roles.find((r) => r.name === RoleType.OWNER);
  const adminRole = roles.find((r) => r.name === RoleType.ADMIN);
  const userRole = roles.find((r) => r.name === RoleType.USER);

  // OWNER角色 - 拥有所有权限
  for (const route of allRoutes) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: ownerRole!.id,
          permissionId: route.id,
        },
      },
      update: {},
      create: {
        roleId: ownerRole!.id,
        permissionId: route.id,
      },
    });
  }

  // ADMIN角色 - 拥有除系统设置外的所有权限
  const adminRoutes = allRoutes.filter((r) => r.name !== 'system-settings');
  for (const route of adminRoutes) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole!.id,
          permissionId: route.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole!.id,
        permissionId: route.id,
      },
    });
  }

  // USER角色 - 只能访问仪表盘
  await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: userRole!.id,
        permissionId: dashboardRoute.id,
      },
    },
    update: {},
    create: {
      roleId: userRole!.id,
      permissionId: dashboardRoute.id,
    },
  });

  console.log('✅ 角色权限分配完成');

  // 4. 创建测试用户
  console.log('创建测试用户...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      phone: '13800138000',
      password: hashedPassword,
      name: '管理员',
      avatar: 'https://via.placeholder.com/100',
      roleName: RoleType.ADMIN,
    },
  });

  // 5. 为用户分配角色
  console.log('为用户分配角色...');

  // 给测试用户分配ADMIN角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: testUser.id,
        roleId: adminRole!.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      roleId: adminRole!.id,
    },
  });

  console.log('✅ 用户角色分配完成');

  // 6. 创建额外的测试用户
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      phone: '13900139000',
      password: hashedPassword,
      name: '系统拥有者',
      avatar: 'https://via.placeholder.com/100',
      roleName: RoleType.OWNER,
    },
  });

  // 创建你的测试用户
  const yourTestUser = await prisma.user.upsert({
    where: { email: '739507691@qq.com' },
    update: {},
    create: {
      email: '739507691@qq.com',
      phone: '17745332578',
      password: hashedPassword,
      name: 'OWNER用户',
      avatar: 'https://via.placeholder.com/100',
      roleName: RoleType.OWNER,
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      phone: '13700137000',
      password: hashedPassword,
      name: '普通用户',
      avatar: 'https://via.placeholder.com/100',
      roleName: RoleType.USER,
    },
  });

  // 分配角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: ownerUser.id,
        roleId: ownerRole!.id,
      },
    },
    update: {},
    create: {
      userId: ownerUser.id,
      roleId: ownerRole!.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: yourTestUser.id,
        roleId: ownerRole!.id,
      },
    },
    update: {},
    create: {
      userId: yourTestUser.id,
      roleId: ownerRole!.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: normalUser.id,
        roleId: userRole!.id,
      },
    },
    update: {},
    create: {
      userId: normalUser.id,
      roleId: userRole!.id,
    },
  });

  // 5. 创建示例用户事件数据
  console.log('创建示例用户事件数据...');
  const sampleEvents = [
    {
      userId: normalUser.id,
      userName: normalUser.name || 'User',
      eventType: 'page_view',
      pagePath: '/dashboard',
      pageTitle: '仪表板',
      duration: 15000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      browser: 'Chrome',
      browserVersion: '120.0.0.0',
      screenResolution: '1920x1080',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      sessionId: 'session-001',
      referrer: '',
    },
    {
      userId: normalUser.id,
      userName: normalUser.name || 'User',
      eventType: 'button_click',
      pagePath: '/dashboard',
      pageTitle: '仪表板',
      elementId: 'user-menu-button',
      elementType: 'button',
      elementText: '用户菜单',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      browser: 'Chrome',
      browserVersion: '120.0.0.0',
      screenResolution: '1920x1080',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      sessionId: 'session-001',
    },
    {
      userId: normalUser.id,
      userName: normalUser.name || 'User',
      eventType: 'api_request',
      apiUrl: '/api/user/profile',
      httpMethod: 'GET',
      responseTime: 245,
      statusCode: 200,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      browser: 'Chrome',
      browserVersion: '120.0.0.0',
      sessionId: 'session-001',
    },
    {
      userId: testUser.id,
      userName: testUser.name || 'Admin',
      eventType: 'page_view',
      pagePath: '/admin/users',
      pageTitle: '用户管理',
      duration: 25000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      browser: 'Chrome',
      browserVersion: '120.0.0.0',
      screenResolution: '1920x1080',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      sessionId: 'session-002',
      referrer: '/dashboard',
    },
    {
      userId: testUser.id,
      userName: testUser.name || 'Admin',
      eventType: 'error',
      pagePath: '/admin/users',
      pageTitle: '用户管理',
      errorMessage: 'Network Error: Failed to fetch user list',
      errorStack: 'Error: Network Error\n    at fetchUsers (users.js:45:12)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      browser: 'Chrome',
      browserVersion: '120.0.0.0',
      sessionId: 'session-002',
    },
  ];

  for (const eventData of sampleEvents) {
    await prisma.userEvent.create({
      data: {
        ...eventData,
        eventData: {},
        tags: [],
        customData: {},
      },
    });
  }

  console.log('✅ 数据库种子数据初始化完成!');

  console.log('\n📊 数据总结:');
  console.log(`- 角色: ${roles.length} 个`);
  console.log(`- 权限路由: ${allRoutes.length} 个`);
  console.log(`- 用户: 4 个`);
  console.log(`- 示例事件: ${sampleEvents.length} 个`);
  console.log('\n👤 测试用户账号:');
  console.log('1. owner@example.com / 123456 (OWNER角色)');
  console.log('2. 739507691@qq.com / 123456 (OWNER角色)');
  console.log('3. admin@example.com / 123456 (ADMIN角色)');
  console.log('4. user@example.com / 123456 (USER角色)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
