import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../user.repository'
import { DistributorRepository } from './distributor.repository'
import { DistributorService } from './distributor.service'
import { DistributorResolver } from './distrubutor.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, DistributorRepository])],
  providers: [DistributorResolver, DistributorService, ConfigService],
  
})
export class DistributorModule {}
