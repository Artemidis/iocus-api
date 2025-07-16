import * as cookieParser from 'cookie-parser';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";
import {ResponseInterceptor} from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
