import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {GraphQLModule} from '@nestjs/graphql'
import {TypeOrmModule} from '@nestjs/typeorm'
import {WinstonModule} from 'nest-winston'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {CardModule} from './card/card.module'
import appConfig from './config/appConfig'
import {GqlConfigService} from './config/gqlConfig.service'
import {TypeOrmConfigService} from './config/typeormConfig.service'
import {WinstonConfigService} from './config/winstonConfig.service'
import {JwtService} from './jwt/jwt.service'
import {RedisAdapterModule} from './redis/redisAdapter.module'
import {UserModule} from './user/user.module'
import {RolesGuard} from './utils/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot({load: [appConfig]}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useClass: GqlConfigService,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    RedisAdapterModule,
    UserModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {provide: APP_GUARD, useClass: RolesGuard},
  ],
})
export class AppModule {}
