import { Controller, Headers, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from './user.service';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/refresh')
  async refresh(@Headers('cookie') cookies: any, @Res() res: Response) {
    return await this.userService.useRefreshToken(cookies, res);
  }
}
