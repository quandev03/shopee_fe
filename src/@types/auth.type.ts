import { User } from './user.type';
// import { ResponseSuccessType } from './utils.type';

type Role = 'Admin' | 'User';
type BackendRole = 'ROLE_ADMIN' | 'ROLE_USER';
export type AuthResponses = ResponseSuccessType<{
  id:string;
  username: string;
  accessToken: string;
  refreshToken: string;
  roles: BackendRole | BackendRole[];
  avatar: string | null;
}>;


export type RefreshTokenResponse = ResponseSuccessType<{
  access_token: string;
}>;
export type ResponseSuccessType<Data> = {
  message: string;
  data: Data;
};