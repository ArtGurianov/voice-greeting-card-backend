import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../user.repository'
import { ManufacturerRepository } from './manufacturer.repository'
import { ManufacturerResolver } from './manufacturer.resolver'
import { ManufacturerService } from './manufacturer.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, ManufacturerRepository])],
  providers: [ManufacturerResolver, ManufacturerService, ConfigService],
})
export class ManufacturerModule {}
