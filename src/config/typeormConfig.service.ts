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
    this.nodeEnv = this.configService.get<string>('nodeEnv', defaultInsecureKey)
    this.pgUrl = this.configService.get<string>(
      'pgUrl',
      'postgres://postgres:Qwerty123@postgres:5432/postgres',
    )
  }

  private readonly nodeEnv: string
  private readonly pgUrl: string

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.pgUrl,
      synchronize: false,
      dropSchema: false,
      logging: this.nodeEnv === 'development' ? true : false,
      keepConnectionAlive: true,
      //entities: getMetadataArgsStorage().tables.map(tbl => tbl.target)
      entities: [__dirname + '/../**/*.entity.[tj]s'],
      subscribers: [__dirname + '/../**/*.subscriber.[tj]s'],
      migrations: [__dirname + '/../**/*.migration.[tj]s'],
      cli: {
        migrationsDir: __dirname + '/../migrations',
        subscribersDir: __dirname + '/../subscribers',
      },
    } as TypeOrmModuleAsyncOptions
  }
}
