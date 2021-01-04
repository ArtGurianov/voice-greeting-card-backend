import {
  Controller,
  Inject,
  LoggerService,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AdminService } from './admin.service';

@ApiTags('user')
@Controller()
export class AdminController implements OnApplicationBootstrap {
  constructor(
    private readonly adminService: AdminService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async onApplicationBootstrap() {
    const id = await this.adminService.injectSuperAdmin();
    if (id) {
      this.logger.log(`Super admin id: ${id}`);
    }
  }
}
