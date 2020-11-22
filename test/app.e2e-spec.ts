import {HttpServer, INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {Connection, EntityManager, QueryRunner} from 'typeorm';

import {AppModule} from '../src/app.module';
import {TypeOrmConfigService} from '../src/config/typeormConfig.service';

import {registerCustomerMutation, usersQuery} from './testQueries';
import {TypeOrmE2EConfigService} from './typeormE2EConfigService';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  // let em: EntityManager
  let queryRunner: QueryRunner;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
        await Test
          .createTestingModule({
            imports: [AppModule],
          })
          .overrideProvider(TypeOrmConfigService)
          .useClass(TypeOrmE2EConfigService)
          .compile();

    app = moduleFixture.createNestApplication();
    httpServer = app.getHttpServer();
    await app.init();

    const dbConnection = moduleFixture.get(Connection);
    const manager = moduleFixture.get(EntityManager);
    // eslint-disable-next-line
    // @ts-ignore
    queryRunner = manager.queryRunner = dbConnection.createQueryRunner('master');
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  it('/GET getHello', async () => {
    const response = await request(httpServer)
      .get('/')
      .expect(200);
    expect(response.text.length).toBeGreaterThan(0);
  });

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
        const users = body.data.users;
        expect(users.length).not.toBeNaN;
        expect(users.length).not.toBeNull;
        expect(users.length).not.toEqual(0);
        expect(users[0]).toHaveProperty('role');
        expect(users[0].role).toEqual('SUPER_ADMIN');
      });
  });

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
        expect(body.data.register.ok).toBeTruthy;
      });
  });
});
