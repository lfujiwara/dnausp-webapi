import { IAuthUser } from './user';

export interface LoginResponse {
  status: 'OK' | 'DENIED';
  reason?: 'WHITELIST';
  user?: IAuthUser;
}
