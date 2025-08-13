export enum PermissionType {
  CATALOGUE = 0,
  MENU = 1,
  BUTTON = 2,
  catalogue = 'CATALOGUE',
  menu = 'MENU',
  button = 'BUTTON',
}

export interface PermissionRole {
  id: string;
  roleId: string;
  permissionId: string;
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: URL;
  newFeature?: boolean;
  children?: Permission[];

  roleId?: string;
  roles?: PermissionRole[];
}

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}
export interface RolePermissionKey {
  id: string;
  roleId: string;
  permissionKeyId: string;
}

export interface PermissionKey {
  id: string;
  label: string;
  name: string;
  roleId?: string;
  RolePermissionKeys?: RolePermissionKey[];
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  role?: Role;
  permissions?: Permission[];
  permissionKeys?: PermissionKey[];
  flattenPermissions?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  label: string;
  order?: number;
  description?: string;
  permission?: Permission[];
}

export enum StorageEnum {
  UserInfo = 'userInfo',
  UserToken = 'userToken',
  Settings = 'settings',
  I18N = 'i18nextLng',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Default = 'default',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
}
