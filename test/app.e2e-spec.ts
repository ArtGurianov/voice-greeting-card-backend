import {HttpServer, INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {GraphQLModule} from '@nestjs/graphql'
import {Test, TestingModule} from '@nestjs/testing'
import {TypeOrmModule} from '@nestjs/typeorm'
import {WinstonModule} from 'nest-winston'
import request from 'supertest'
import {AppController} from '../src/app.controller'
import {AppService} from '../src/app.service'
import {CardModule} from '../src/card/card.module'
import appConfig from '../src/config/appConfig'
import {MockGqlConfigService} from '../src/config/mockGqlConfig.service'
import {MockTypeOrmConfigService} from '../src/config/mockTypeormConfig.service'
import {WinstonConfigService} from '../src/config/winstonConfig.service'
import {JwtService} from '../src/jwt/jwt.service'
import {RedisAdapterModule} from '../src/redis/redisAdapter.module'
import {UserModule} from '../src/user/user.module'
import {RolesGuard} from '../src/utils/roles.guard'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let httpServer: HttpServer
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({load: [appConfig]}),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: MockTypeOrmConfigService,
        }),
        GraphQLModule.forRootAsync({
          imports: [ConfigModule],
          useClass: MockGqlConfigService,
        }),
        WinstonModule.forRootAsync({
          imports: [ConfigModule],
          useClass: WinstonConfigService,
        }),
        RedisAdapterModule,
        UserModule,
        CardModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        JwtService,
        {provide: APP_GUARD, useClass: RolesGuard},
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    httpServer = app.getHttpServer()
    await app.init()
  })

  afterAll(async done => {
    await app.close()
    done()
  })

  it('/GET getHello', async () => {
    const response = await request(httpServer)
      .get('/')
      .expect(200)
    expect(response.text).toEqual('Hello World!')
  })

  const usersQuery = `
  query {
    users {
      id
      role
    }
  }`

  it('/graphql (POST) query:users', async () => {
    return request(httpServer)
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: usersQuery,
      })
      .expect(200)
      .expect(({body}) => {
        const users = body.data.users
        expect(users.length).not.toBeNaN
        expect(users.length).not.toBeNull
        expect(users.length).not.toEqual(0)
        expect(users[0]).toHaveProperty('role')
        expect(users[0].role).toEqual('SUPER_ADMIN')
      })
  })
})
