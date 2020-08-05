import {Injectable, InternalServerErrorException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectRepository} from '@nestjs/typeorm'
import {Logger} from 'nestjs-pino'
import {UserRoles} from '../../types/roles'
import {defaultInsecureKey} from '../../utils/constants'
import {UserRepository} from '../user.repository'
import {AdminRepository} from './admin.repository'

@Injectable()
export class AdminService {
  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    @InjectRepository(AdminRepository)
    private readonly adminRepo: AdminRepository,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async injectSuperAdmin() {
    const newUser = await this.userRepo.create({
      email: this.configService.get<string>(
        'superAdminEmail',
        defaultInsecureKey,
      ),
      role: UserRoles.SUPER_ADMIN,
      password: this.configService.get<string>(
        'superAdminPassword',
        defaultInsecureKey,
      ),
    })
    const newAdmin = await this.adminRepo.save({user: newUser})
    if (!newAdmin)
      throw new InternalServerErrorException('could not create admin record')

    this.logger.log(
      `Super Admin created. Please login with: ${this.configService.get<string>(
        'superAdminEmail',
        defaultInsecureKey,
      )}`,
    )
  }
}
