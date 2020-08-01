import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {GraphQLModule} from '@nestjs/graphql'
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AudioModule} from './card/audio/audio.module'
import {CardModule} from './card/card.module'
import appConfig from './config/appConfig'
import {JwtService} from './jwt/jwt.service'
import {RedisAdapterModule} from './redis/redisAdapter.module'
import {UserModule} from './user/user.module'
import {defaultInsecureKey} from './utils/constants'
import {RolesGuard} from './utils/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot({load: [appConfig]}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          //name: 'someName', //DO NOT PROVIDE NAME! forFeature(ENTITY) will cause naming problem.
          host: configService.get<string>('pgHost', defaultInsecureKey),
          port: configService.get<string>('pgPort', defaultInsecureKey),
          username: configService.get<string>('pgUsername', defaultInsecureKey),
          password: configService.get<string>('pgPassword', defaultInsecureKey),
          database: configService.get<string>('pgDatabase', defaultInsecureKey),
          synchronize:
            configService.get<string>('nodeEnv', defaultInsecureKey) ===
            'production'
              ? false
              : true,
          dropSchema:
            configService.get<string>('nodeEnv', defaultInsecureKey) ===
            'production'
              ? false
              : true,
          logging:
            configService.get<string>('nodeEnv', defaultInsecureKey) ===
            'production'
              ? false
              : true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
        } as TypeOrmModuleAsyncOptions
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot({
      cors: {origin: 'http://localhost:3000', credentials: true},
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      //autoSchemaFile: true,
      //path: path.join(process.cwd(), 'src/schema.gql'),
      playground: true,
      context: ({req, res}) => ({
        req,
        res,
      }),
    }),
    RedisAdapterModule,
    AudioModule,
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
