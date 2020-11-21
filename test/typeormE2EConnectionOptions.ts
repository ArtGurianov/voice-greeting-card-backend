import {
    TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import appConfig from '../src/config/appConfig';


dotenv.config();
const config = appConfig();

const connOpts: TypeOrmModuleOptions = {
  type: 'postgres',
  // url: config.pgUrl,
  url: 'postgres://postgres:@127.0.0.1:5432/e2e_tests',
  synchronize: false,
  dropSchema: false,
  logging: config.nodeEnv === 'development' ? true : false,
  //reading from
  entities: ['!(dist)/**/*.entity.[tj]s'],
  subscribers: ['!(dist)/subscribers/*.[tj]s'],
  migrations: ['!(dist)/migrations/*.[tj]s'],
  cli: {
    //generating to:
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/migrations',
  },
};

export default connOpts;
