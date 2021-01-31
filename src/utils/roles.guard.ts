import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Reflector} from '@nestjs/core';
import {GqlContextType, GqlExecutionContext} from '@nestjs/graphql';
import {JwtService} from 'src/jwt/jwt.service';
import {UserRoles} from 'src/types/roles';

const BEARER_PREFIX = 'Bearer ';
const FAKE_AUTH_PREFIX = 'FakeAuth ';
const ROLE_STRINGS = Object.values(UserRoles);
const FAKE_AUTH_ENVS = ['development', 'test'];

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject('JwtService') private readonly jwtService: JwtService,
    @Inject('ConfigService') private readonly configService: ConfigService,
  ) {}

  getContextAndRequest(context: ExecutionContext) {
    switch (context.getType<GqlContextType>()) {
    case 'graphql':
      const ctx = GqlExecutionContext.create(context);
      return {ctx: ctx.getContext(), req: ctx.getContext().req};
    default:
      return {
        ctx: context.switchToHttp(),
        req: context.switchToHttp().getRequest(),
      };
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const {ctx, req} = this.getContextAndRequest(context);
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'No auth header included in your request!',
      );
    }

    let jwtPayload = { role: '' };
    const nodeEnv = this.configService.get<string>('nodeEnv');

    if (nodeEnv
     && FAKE_AUTH_ENVS.includes(nodeEnv)
     && authHeader.startsWith(FAKE_AUTH_PREFIX))
    {
      const role = authHeader.slice(FAKE_AUTH_PREFIX.length);

      if (!ROLE_STRINGS.includes(role)) {
        throw new UnauthorizedException(`incorrect role: ${role}`);
      }

      jwtPayload = { role };
    } else if (authHeader.startsWith(BEARER_PREFIX)) {
      const token = authHeader.slice(BEARER_PREFIX.length);
      jwtPayload = this.jwtService.verifyAccessToken(token);

      if (!jwtPayload) {
        throw new UnauthorizedException('Invalid jwt!');
      }
    } else {
      throw new UnauthorizedException(
        'Incorrect auth header format',
      );
    }

    const acceptedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (
      !acceptedRoles ||
      !acceptedRoles.length ||
      acceptedRoles.includes(jwtPayload.role)
    ) {
      ctx.jwtPayload = jwtPayload as any;
      req.jwtPayload = jwtPayload as any;
      return true;
    }
    throw new UnauthorizedException(
      "You don't have permission to access this resource",
    );
  }
}
