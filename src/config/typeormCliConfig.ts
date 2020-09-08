import * as dotenv from 'dotenv'
import {ConnectionOptions} from 'typeorm'
import appConfig from './appConfig'

dotenv.config()
const config = appConfig()

module.exports = {
  type: 'postgres',
  url: config.pg.pgUrl,
  synchronize: false,
  dropSchema: false,
  logging: config.nodeEnv === 'development' ? true : false,
  keepConnectionAlive: true,
  //reading from
  entities: ['src/**/*.entity{.ts,.js}'],
  subscribers: ['dist/subscribers/*{.js,.map}'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    //generating to:
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/migrations',
  },
} as ConnectionOptions
