import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';

import {AppService} from './app.service';
import {Public} from './utils/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
