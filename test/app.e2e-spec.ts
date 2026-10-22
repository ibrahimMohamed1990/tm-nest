import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseInterceptor } from '../src/common/response.interceptor';
import { HttpExceptionFilter } from '../src/common/http-exception.filter';

// يحتاج MySQL شغال (XAMPP) ومتغيرات .env صحيحة
describe('Task Manager (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const email = `user${Date.now()}@test.com`;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(() => app.close());

  it('rejects tasks without a token', () =>
    request(app.getHttpServer()).get('/api/tasks').expect(401));

  it('POST /api/auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password: '123456' })
      .expect(201);
    token = res.body.data.access_token;
    expect(token).toBeDefined();
  });

  it('POST /api/tasks then GET /api/tasks', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Learn NestJS' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.data.total).toBe(1);
  });

  it('validates the body', () =>
    request(app.getHttpServer())
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x' })
      .expect(400));
});
