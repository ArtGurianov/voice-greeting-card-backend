import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {JwtService} from '../jwt/jwt.service';
import {AdminModule} from './admin/admin.module';
import {AdminRepository} from './admin/admin.repository';
import {CustomerRepository} from './customer/customer.repository';
import {DistributorRepository} from './distributor/distributor.repository';
import {ManufacturerRepository} from './manufacturer/manufacturer.repository';
import {UserController} from './user.controller';
import {UserRepository} from './user.repository';
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      AdminRepository,
      CustomerRepository,
      DistributorRepository,
      ManufacturerRepository,
    ]),
    AdminModule,
  ],
  providers: [UserResolver, UserService, JwtService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
