import {Controller, Headers, Post, Res} from '@nestjs/common'
import {Response} from 'express'
import {UserService} from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/refresh_token')
  async refresh(@Headers('cookie') cookies: any, @Res() res: Response) {
    return await this.userService.useRefreshToken(cookies, res)
  }
}
