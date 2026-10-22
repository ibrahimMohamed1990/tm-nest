import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // يحذف الحقول غير المعرّفة في الـ DTO
      forbidNonWhitelisted: true, // يرفض الطلب لو فيه حقول زيادة
      transform: true, // يحوّل الأنواع تلقائيًا (string -> number)
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger: http://localhost:3000/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API:  http://localhost:${port}/api`);
  console.log(`Docs: http://localhost:${port}/docs`);
}
bootstrap();
