import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {GqlContextType, GqlExecutionContext} from '@nestjs/graphql'
import {JwtService} from '../jwt/jwt.service'

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    @Inject('JwtService') private readonly jwtService: JwtService,
  ) {}

  getContextAndRequest(context: ExecutionContext) {
    switch (context.getType<GqlContextType>()) {
      case 'graphql':
        const ctx = GqlExecutionContext.create(context)
        return {ctx: ctx.getContext(), req: ctx.getContext().req}
      default:
        return {
          ctx: context.switchToHttp(),
          req: context.switchToHttp().getRequest(),
        }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    )
    if (isPublic) {
      return true
    }

    const {ctx, req} = this.getContextAndRequest(context)
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      throw new UnauthorizedException('Please login to access this resource!')
    }

    try {
      const token = authHeader.split(' ')[1]
      console.log(token)
      const jwtPayload = this.jwtService.verifyAccessToken(token)
      if (!jwtPayload)
        throw new UnauthorizedException('Please login to access this resource!')

      const acceptedRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      )

      if (!acceptedRoles || !acceptedRoles.length) return true

      if (!acceptedRoles.includes(jwtPayload.role)) {
        throw new UnauthorizedException(
          "You don't have permission to access this resource",
        )
      }
      ctx.jwtPayload = jwtPayload as any
      req.jwtPayload = jwtPayload as any
      return true
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException(
        'Error has occured during parsing your auth token!',
      )
    }
  }
}
