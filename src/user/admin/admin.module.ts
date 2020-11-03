import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../user.repository'
import { AdminController } from './admin.controller'
import { AdminRepository } from './admin.repository'
import { AdminResolver } from './admin.resolver'
import { AdminService } from './admin.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, AdminRepository])],
  providers: [AdminResolver, AdminService, ConfigService],
  controllers: [AdminController],
})
export class AdminModule {}
