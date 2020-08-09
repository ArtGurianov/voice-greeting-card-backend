import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {InjectRepository} from '@nestjs/typeorm'
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston'
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
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
