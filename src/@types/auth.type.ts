import { User } from './user.type';
import { ResponseSuccessType } from './utils.type';

export type AuthResponse = ResponseSuccessType<{
  access_token: string;
  expires: number;
  refresh_token: string;
  expires_refresh_token: number;
  user: User;
}>;

export type RefreshTokenResponse = ResponseSuccessType<{
  access_token: string;
}>;
