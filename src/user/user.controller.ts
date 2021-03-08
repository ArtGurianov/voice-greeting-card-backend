import {
  Body,
  Controller,
  Headers,
  Param,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthTypes } from '../types/authTypes';
import { UserRoles } from '../types/roles';
import { baseValidationPipe } from '../utils/baseValidationPipe';
import { CustomResult } from '../utils/CustomResult';
import { Public } from '../utils/public.decorator';
import { Roles } from '../utils/roles.decorator';
import { LoginInput } from './input/user.loginInput';
import { RegisterInput } from './input/user.registerInput';
import { MeResult } from './user.customResults';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/refresh')
  async refresh(
    @Headers('cookie') cookies: any,
    @Res() res: Response,
  ): Promise<void> {
    const accessToken = await this.userService.useRefreshToken(cookies, res);
    res.status(200).send({ accessToken });
    return;
  }

  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  @Get('/users')
  async users(): Promise<User[]> {
    return await this.userService.users();
  }

  @Public()
  @Post('/register')
  async register(
    @Body('registerInput', baseValidationPipe)
    registerInput: RegisterInput,
  ): Promise<CustomResult> {
    return await this.userService.register(registerInput);
  }

  @Public()
  @Post('/login')
  async login(
    @Body('loginInput', baseValidationPipe)
    loginInput: LoginInput,
    @Res() res: Response,
  ): Promise<void> {
    const accessToken = await this.userService.login(loginInput, res);
    res.status(200).send({ accessToken });
    return;
  }

  @Post('/logout')
  async logout(@Res() res: Response): Promise<void> {
    const success = await this.userService.logout(res);
    res.status(200).send({ success });
  }

  @Get('/me')
  async me(@Req() { jwtPayload }: Request): Promise<MeResult> {
    //jwtPayload has "!" mark as guaranteed because this method gets accessed after bypassing global RolesGuard
    if (jwtPayload!.authType === AuthTypes.FakeAuth) {
      return new CustomResult({
        ok: true,
        value: `Authorized as a fake user with ${jwtPayload!.userRole} role`,
      });
    }
    return await this.userService.me(jwtPayload!.userId);
  }

  @Post('/revokeRefreshToken/:userId')
  async revokeRefreshToken(@Param('userId') userId: string): Promise<boolean> {
    return await this.userService.revokeRefreshToken(userId);
  }
}
