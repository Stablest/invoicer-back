import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionsFilter } from './global/exceptions/global.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: process.env.ORIGIN });
  app.useGlobalFilters(new GlobalExceptionsFilter(app.get(HttpAdapterHost)));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(4000);
}
bootstrap();
