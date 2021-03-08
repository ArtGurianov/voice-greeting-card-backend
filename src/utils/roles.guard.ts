import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { JwtService } from 'src/jwt/jwt.service';
import { UserRoles } from 'src/types/roles';
import { AuthTypes } from 'src/types/authTypes';
import { JwtPayload } from 'src/types/jwtPayload';

const BEARER_PREFIX = `${AuthTypes.Bearer} `;
const FAKE_AUTH_PREFIX = `${AuthTypes.FakeAuth} `;
const ROLE_STRINGS = Object.values(UserRoles);
const FAKE_AUTH_ENVS = ['development', 'test'];

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject('JwtService') private readonly jwtService: JwtService,
    @Inject('ConfigService') private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'No auth header included in your request!',
      );
    }

    let jwtPayload: JwtPayload = {
      authType: AuthTypes.Idle,
      userRole: UserRoles.CUSTOMER,
      iat: -1,
      exp: -1,
      userId: 'Idle',
    };
    const nodeEnv = this.configService.get<string>('nodeEnv');

    if (
      nodeEnv &&
      FAKE_AUTH_ENVS.includes(nodeEnv) &&
      authHeader.startsWith(FAKE_AUTH_PREFIX)
    ) {
      const userRole = authHeader.slice(FAKE_AUTH_PREFIX.length);

      if (!ROLE_STRINGS.includes(userRole)) {
        throw new UnauthorizedException(`incorrect role: ${userRole}`);
      }

      jwtPayload = { ...jwtPayload, userRole, authType: AuthTypes.FakeAuth };
    } else if (authHeader.startsWith(BEARER_PREFIX)) {
      const token = authHeader.slice(BEARER_PREFIX.length);
      jwtPayload = this.jwtService.verifyAccessToken(token);

      if (!jwtPayload) {
        throw new UnauthorizedException('Invalid jwt!');
      }
    } else {
      throw new UnauthorizedException('Incorrect auth header format');
    }

    const acceptedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (
      !acceptedRoles ||
      !acceptedRoles.length ||
      acceptedRoles.includes(jwtPayload.userRole)
    ) {
      req.jwtPayload = jwtPayload as any;
      return true;
    }
    throw new UnauthorizedException(
      "You don't have permission to access this resource",
    );
  }
}
