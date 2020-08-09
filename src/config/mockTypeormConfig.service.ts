import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm'
import {defaultInsecureKey} from '../utils/constants'

@Injectable()
export class MockTypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      //name: 'someName', //DO NOT PROVIDE NAME! forFeature(ENTITY) will cause naming problem.
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
        'pgTestDatabase',
        defaultInsecureKey,
      ),
      synchronize: true,
      dropSchema: true,
      logging: false,
      keepConnectionAlive: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
      //entities: ['dist/**/*.entity{.ts,.js}'],
      //subscribers: ['dist/**/*.subscriber{.ts,.js}'],
    } as TypeOrmModuleAsyncOptions
  }
}
