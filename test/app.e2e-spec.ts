import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { WebModule } from '../src/web/web.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .then((res) => {
        expect(res.body?.status).toBe('ok');
      });
  });

  test('stuff', () => {
    expect(1 + 1).toBe(2);
  });
});
