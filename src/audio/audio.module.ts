import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AudioController} from './audio.controller'
import {AudioRepository} from './audio.repository'
import {AudioService} from './audio.service'

@Module({
  imports: [TypeOrmModule.forFeature([AudioRepository])],
  providers: [AudioService, ConfigService],
  controllers: [AudioController],
})
export class AudioModule {}
