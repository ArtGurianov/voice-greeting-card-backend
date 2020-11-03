import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../user.repository'
import { CustomerRepository } from './customer.repository'
import { CustomerResolver } from './customer.resolver'
import { CustomerService } from './customer.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, CustomerRepository])],
  providers: [CustomerResolver, CustomerService, ConfigService],
})
export class CustomerModule {}
