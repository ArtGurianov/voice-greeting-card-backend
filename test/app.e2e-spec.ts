import {HttpServer, INestApplication} from '@nestjs/common'
import {Test, TestingModule} from '@nestjs/testing'
import request from 'supertest'
import {AppModule} from '../src/app.module'
import {registerCustomerMutation, usersQuery} from './testQueries'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let httpServer: HttpServer
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it('/graphql (POST) mutation:register', async () => {
    return request(httpServer)
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: registerCustomerMutation,
      })
      .expect(200)
      .expect(({body}) => {
        expect(body.data.register.ok).toBeTruthy
      })
  })
})
