import {Controller, Headers, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {ApiTags} from '@nestjs/swagger';

import {UserService} from './user.service';

@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/refresh')
  async refresh(@Headers('cookie') cookies: any, @Res() res: Response) {
    return await this.userService.useRefreshToken(cookies, res);
  }
}
