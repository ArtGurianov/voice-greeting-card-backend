import {HttpServer, INestApplication} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {Test, TestingModule} from '@nestjs/testing'
import {TypeOrmModule} from '@nestjs/typeorm'
import {WinstonModule} from 'nest-winston'
import request from 'supertest'
import {AppController} from '../src/app.controller'
import {AppService} from '../src/app.service'
import appConfig from '../src/config/appConfig'
import {MockTypeOrmConfigService} from '../src/config/mockTypeormConfig.service'
import {WinstonConfigService} from '../src/config/winstonConfig.service'

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
        // GraphQLModule.forRoot({
        //   installSubscriptionHandlers: true,
        //   autoSchemaFile: 'schema.gql',
        //   context: ({req, res}) => ({
        //     req,
        //     res,
        //   }),
        // }),
        WinstonModule.forRootAsync({
          imports: [ConfigModule],
          useClass: WinstonConfigService,
        }),
      ],
      providers: [AppService],
      controllers: [AppController],
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
})
