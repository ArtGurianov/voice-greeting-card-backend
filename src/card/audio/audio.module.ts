import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {RedisServiceAdapter} from 'src/redis/redisAdapter.service';
import {CardRepository} from 'src/card/card.repository';
import {AudioController} from './audio.controller';
import {AudioResolver} from './audio.resolver';
import {AudioService} from './audio.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository])],
  providers: [AudioResolver, AudioService, ConfigService, RedisServiceAdapter],
  controllers: [AudioController],
})
export class AudioModule {}
