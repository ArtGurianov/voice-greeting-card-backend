import {Injectable} from '@nestjs/common';
import {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import connectionOpts from './typeormConnectionOptions';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor() {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...connectionOpts,
      keepConnectionAlive: true,
    };
  }
};
