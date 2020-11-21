import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRoles} from '../../types/roles';
import {defaultInsecureKey} from '../../utils/constants';
import {UserRepository} from '../user.repository';
import {AdminRepository} from './admin.repository';

@Injectable()
export class AdminService {
  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    @InjectRepository(AdminRepository)
    private readonly adminRepo: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async injectSuperAdmin(): Promise<string> {
    const superAdminEmail = this.configService.get<string>(
      'superAdminEmail',
      defaultInsecureKey,
    );
    const superAdmin = await this.userRepo.findOne({
      email: superAdminEmail,
    });

    if (superAdmin) return superAdmin.id;

    const newUser = await this.userRepo.create({
      email: superAdminEmail,
      role: UserRoles.SUPER_ADMIN,
      password: this.configService.get<string>(
        'superAdminPassword',
        defaultInsecureKey,
      ),
    });
    if (!newUser)
      throw new InternalServerErrorException('could not create user record');

    const newSuperAdmin = await this.adminRepo.save({user: newUser});
    if (!newSuperAdmin)
      throw new InternalServerErrorException('could not create admin record');

    return newSuperAdmin.id;
  }
}
