import * as dotenv from 'dotenv';
import {ConnectionOptions} from 'typeorm';
import appConfig from './appConfig';

dotenv.config();
const config = appConfig();

module.exports = {
  type: 'postgres',
  url: config.pgUrl,
  synchronize: false,
  dropSchema: false,
  logging: config.nodeEnv === 'development' ? true : false,
  keepConnectionAlive: true,
  //reading from
  entities: ['src/**/*.entity.[tj]s'],
  subscribers: ['src/subscribers/*.[tj]s'],
  migrations: ['src/migrations/*.[tj]s'],
  cli: {
    //generating to:
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/migrations',
  },
} as ConnectionOptions;
