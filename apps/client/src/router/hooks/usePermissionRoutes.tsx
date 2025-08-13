import {
  useUserFlattenPermissions,
  useUserPermission,
} from '@/store/user-store';
import { useMemo } from 'react';

// 获取权限路由
export function usePermissionRoutes() {
  const permissions = useUserPermission();
  const flattenedPermissions = useUserFlattenPermissions();

  return useMemo(() => {
    if (!permissions || !flattenedPermissions) return [];

    return transformPermissionsToRoutes(permissions, flattenedPermissions);
  }, [permissions]);
}
  