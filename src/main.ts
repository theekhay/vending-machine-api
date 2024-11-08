import { NestFactory } from '@nestjs/core';
import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
  Logger as NestLogger,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/rcp-exception.filter';
import { Transport } from '@nestjs/microservices';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_URL')],
      queue: 'service.vendaw-business-new',
      routingKey: 'service.vendaw-business-new',
      exchange: 'hoshistech-exchange',
      exchangeType: 'topic',
      noAck: false,
      queueOptions: {
        durable: true,
      },
      enableControllerDiscovery: true,
    },
  });

  // Enable CORS with custom options
  app.enableCors();

  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vending-machine-api')
    .setDescription('This is the documentation for the vending machine api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT auth token',
      in: 'header',
    })
    .addTag('vendaw-machine-api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useLogger(app.get(Logger));
  app.enableCors();

  const httpRef = app.getHttpAdapter().getHttpServer();
  app.useGlobalFilters(new AllExceptionsFilter(httpRef, new NestLogger()));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'), () =>
    console.log(`App is running on: ${configService.get('PORT')}`),
  );
}
bootstrap();
