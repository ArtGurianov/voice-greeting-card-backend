import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm'
import {defaultInsecureKey} from '../utils/constants'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService) {
    this.nodeEnv = configService.get<string>('nodeEnv', defaultInsecureKey)
  }

  private readonly nodeEnv: string

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
<<<<<<< HEAD
      url: this.configService.get<string>('pgUrl', defaultInsecureKey),
      //name: 'someName', //DO NOT PROVIDE NAME! forFeature(ENTITY) will cause naming problem.
      //host: this.configService.get<string>('pgHost', defaultInsecureKey),
      //port: this.configService.get<string>('pgPort', defaultInsecureKey),
      // username: this.configService.get<string>(
      //   'pgUsername',
      //   defaultInsecureKey,
      // ),
      // password: this.configService.get<string>(
      //   'pgPassword',
      //   defaultInsecureKey,
      // ),
      // database: this.configService.get<string>(
      //   'pgDatabase',
      //   defaultInsecureKey,
      // ),
      synchronize: this.nodeEnv === 'production' ? false : true,
      dropSchema: this.nodeEnv === 'production' ? false : true,
      logging: this.nodeEnv === 'production' ? false : true,
=======
      host: this.configService.get<string>('pgHost', defaultInsecureKey),
      port: this.configService.get<string>('pgPort', defaultInsecureKey),
      username: this.configService.get<string>(
        'pgUsername',
        defaultInsecureKey,
      ),
      password: this.configService.get<string>(
        'pgPassword',
        defaultInsecureKey,
      ),
      database: this.configService.get<string>(
        'pgDatabase',
        defaultInsecureKey,
      ),
      synchronize: this.nodeEnv === 'development' ? true : false,
      dropSchema: this.nodeEnv === 'development' ? true : false,
      logging: this.nodeEnv === 'development' ? true : false,
>>>>>>> tests-and-configs-fix
      keepConnectionAlive: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
      migrations: [__dirname + '/../**/*.migration{.ts,.js}'],
      cli: {
        migrationsDir: __dirname + '/../migrations',
        //   subscribersDir: __dirname + '/../subscribers',
      },
    } as TypeOrmModuleAsyncOptions
  }
}
