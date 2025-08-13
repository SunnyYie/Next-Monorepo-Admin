import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageEnum, UserInfo, UserToken } from './types';
import { create } from 'zustand';

type UserStore = {
  userInfo: Partial<UserInfo>;
  userToken: UserToken;
  actions: {
    setUserInfo: (userInfo: UserInfo) => void;
    setUserToken: (token: UserToken) => void;
    clearUserInfoAndToken: () => void;
  };
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {},
      userToken: {},
      actions: {
        setUserInfo: (userInfo) => {
          set({ userInfo });
        },
        setUserToken: (userToken) => {
          set({ userToken });
        },
        clearUserInfoAndToken() {
          set({ userInfo: {}, userToken: {} });
        },
      },
    }),
    // 将数据存储到 localStorage
    {
      name: 'userStore',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        [StorageEnum.UserInfo]: state.userInfo,
        [StorageEnum.UserToken]: state.userToken,
      }),
    }
  )
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () =>
  useUserStore((state) => state.userInfo.permissions);
export const useUserPermissionKeys = () =>
  useUserStore((state) => state.userInfo.permissionKeys);
export const useUserFlattenPermissions = () =>
  useUserStore((state) => state.userInfo.flattenPermissions);
export const useUserActions = () => useUserStore((state) => state.actions);

export default useUserStore;
