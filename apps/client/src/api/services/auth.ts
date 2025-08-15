import { UserInfo, UserToken } from '@/store/types';
import apiClient from '@/api/api-client';

export interface SignInReq {
  email?: string;
  phone?: string;
  password: string;
}

export interface SignUpReq extends SignInReq {
  phone: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
  SignIn = '/auth/login',
  SignUp = '/auth/register',
  Logout = '/auth/logout',

  GetUsers = '/user/getUsers',
  GetUserDetail = '/user/getUserDetail',
  CreateUser = '/user/createUser',
  SearchUser = '/user/getUsersByCondition',
  UpdateUser = '/user/updateUser',
  DeleteUser = '/user/deleteUser',
}

const signin = (data: SignInReq) =>
  apiClient.post<SignInRes>({ url: UserApi.SignIn, data });
const signup = (data: SignUpReq) =>
  apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });

const getUsers = () => apiClient.get<UserInfo[]>({ url: UserApi.GetUsers });
const getUserDetail = (id: string) =>
  apiClient.get<UserInfo>({ url: UserApi.GetUserDetail, params: { id } });
const createUser = (data: UserInfo) =>
  apiClient.post<UserInfo>({ url: UserApi.CreateUser, data });
const searchUser = (data: { name?: string; email?: string }) =>
  apiClient.get<UserInfo[]>({ url: UserApi.SearchUser, params: data });
const updateUser = (data: { id: string; data: UserInfo }) =>
  apiClient.put<UserInfo>({ url: UserApi.UpdateUser, data });
const deleteUser = (data: { id: string }) =>
  apiClient.delete<UserInfo>({ url: UserApi.DeleteUser, data });

export default {
  signin,
  signup,
  logout,

  getUsers,
  getUserDetail,
  createUser,
  searchUser,
  updateUser,
  deleteUser,
};
