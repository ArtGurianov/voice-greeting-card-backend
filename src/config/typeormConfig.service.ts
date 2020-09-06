import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm'
import {defaultInsecureKey} from '../utils/constants'
import {PGConfig} from './appConfig'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService) {
    this.nodeEnv = this.configService.get<string>('nodeEnv', defaultInsecureKey)
    this.pgConfig = this.configService.get<PGConfig>('pg', {
      pgUrl: defaultInsecureKey,
    })
  }

  private readonly nodeEnv: string
  private readonly pgConfig: PGConfig

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.pgConfig.pgUrl,
      synchronize: this.nodeEnv === 'development' ? true : false,
      dropSchema: this.nodeEnv === 'development' ? true : false,
      logging: this.nodeEnv === 'development' ? true : false,
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
