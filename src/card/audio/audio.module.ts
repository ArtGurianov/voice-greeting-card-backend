import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {RedisServiceAdapter} from '../../redis/redisAdapter.service'
import {CardRepository} from '../card.repository'
import {AudioController} from './audio.controller'
import {AudioService} from './audio.service'

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository])],
  providers: [AudioService, ConfigService, RedisServiceAdapter],
  controllers: [AudioController],
})
export class AudioModule {}
