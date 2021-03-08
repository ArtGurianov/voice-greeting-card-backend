import { AuthTypes } from './authTypes';
import { UserRoles } from './roles';
export interface JwtPayload {
  authType: AuthTypes;
  userId: string;
  userRole: UserRoles;
  iat: number;
  exp: number;
}
