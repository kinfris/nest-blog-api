import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception.filter';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const validationErrors = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((cKey) => {
            validationErrors.push({
              message: e.constraints[cKey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(validationErrors);
      },
    }),
  );
  //useContainer(app.select(AppModule), { fallback: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5000);
}

bootstrap();
