import {Module} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {GraphQLModule} from '@nestjs/graphql'
import {TypeOrmModule, TypeOrmModuleAsyncOptions} from '@nestjs/typeorm'
import {LoggerModule} from 'nestjs-pino'
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
        const nodeEnv = configService.get<string>('nodeEnv', defaultInsecureKey)
        return {
          type: 'postgres',
          //name: 'someName', //DO NOT PROVIDE NAME! forFeature(ENTITY) will cause naming problem.
          host: configService.get<string>('pgHost', defaultInsecureKey),
          port: configService.get<string>('pgPort', defaultInsecureKey),
          username: configService.get<string>('pgUsername', defaultInsecureKey),
          password: configService.get<string>('pgPassword', defaultInsecureKey),
          database: configService.get<string>('pgDatabase', defaultInsecureKey),
          synchronize: nodeEnv === 'production' ? false : true,
          dropSchema: nodeEnv === 'production' ? false : true,
          logging: nodeEnv === 'production' ? false : true,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
        } as TypeOrmModuleAsyncOptions
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        cors: {
          origin: configService.get<string>(
            'frontendHostUrl',
            defaultInsecureKey,
          ),
          credentials: true,
        },
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
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('nodeEnv', defaultInsecureKey)
        return {
          pinoHttp: {
            prettyPrint:
              nodeEnv !== 'production'
                ? {
                    colorize: true,
                    //levelFirst: true,
                    translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
                    level: 'debug',
                    //useLevelLabels: true,
                    autoLogging: false,
                  }
                : {level: 'info'},
          },
        }
      },
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
