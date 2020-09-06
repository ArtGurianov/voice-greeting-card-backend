import Joi from '@hapi/joi'
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
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid(
          'development',
          'test',
          'staging',
          'production',
        ),
        SERVER_PORT: Joi.number(),
        FRONTEND_HOST_URL: Joi.string(),
        WITAI_KEY: Joi.string(),
        JWT_ACCESS_SECRET: Joi.string(),
        JWT_REFRESH_SECRET: Joi.string(),
        SUPER_ADMIN_EMAIL: Joi.string(),
        SUPER_ADMIN_PASSWORD: Joi.string(),
        S3_BUCKET_URL: Joi.string(),
        S3_BUCKET_NAME: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_REGION: Joi.string(),
        REDIS_URL: Joi.string(),
        PG_URL: Joi.string(),
      }),
    }),
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
