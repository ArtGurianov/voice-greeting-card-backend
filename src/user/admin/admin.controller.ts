import {Controller, OnApplicationBootstrap} from '@nestjs/common'
import {AdminService} from './admin.service'

@Controller()
export class AdminController implements OnApplicationBootstrap {
  constructor(private readonly adminService: AdminService) {}

  onApplicationBootstrap() {
    this.adminService.injectSuperAdmin()
  }
}
