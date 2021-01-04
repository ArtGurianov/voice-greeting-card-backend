import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';

import { defaultInsecureKey } from 'src/utils/constants';
import { RedisServiceAdapter } from './redisAdapter.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          url: configService.get<string>('redisUrl', defaultInsecureKey),
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [RedisServiceAdapter],
  exports: [RedisServiceAdapter],
})
export class RedisAdapterModule {}
