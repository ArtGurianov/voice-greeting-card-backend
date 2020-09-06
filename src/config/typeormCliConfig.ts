import {ConnectionOptions} from 'typeorm'
import appConfig from './appConfig'

const config = appConfig()

module.exports = {
  type: 'postgres',
  url: config.pg.pgUrl,
  //   host: config.pg.pgHost,
  //   port: config.pg.pgPort,
  //   username: config.pg.pgUsername,
  //   password: config.pg.pgPassword,
  //   database: config.pg.pgDatabase,
  synchronize: config.nodeEnv === 'development' ? true : false,
  dropSchema: config.nodeEnv === 'development' ? true : false,
  logging: config.nodeEnv === 'development' ? true : false,
  keepConnectionAlive: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  subscribers: ['src/**/*.subscriber{.ts,.js}'],
  migrations: ['src/**/*.migration{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
} as ConnectionOptions
