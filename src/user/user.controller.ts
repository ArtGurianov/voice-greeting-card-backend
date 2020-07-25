import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import {Response} from 'express'
import {Public} from '../utils/public.decorator'
import {RegisterInput} from './input/user.registerInput'
import {UserService} from './user.service'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/register')
  async register(@Body() registerInput: RegisterInput) {
    return await this.userService.register(registerInput)
  }

  @Public()
  @Post('/login')
  async login(
    @Res() res: Response,
    @Body() loginDto: {email: string; password: string},
  ) {
    const accessToken = await this.userService.login(loginDto, res)
    if (!accessToken) throw new UnauthorizedException()
    res.send(accessToken)
  }

  @Post('/me')
  async me(@Headers('authorization') authorization: string) {
    return await this.userService.me(authorization)
  }

  @Post('/refresh')
  async refresh(@Headers('cookie') cookies: any, @Res() res: Response) {
    return await this.userService.useRefreshToken(cookies, res)
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    return await this.userService.logout(res)
  }
}
