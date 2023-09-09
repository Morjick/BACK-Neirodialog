import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CreateResponseInterceptor } from './interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { findOrCreateRootUser } from './vendor/onStart';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new CreateResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Neirodialog - Open Api')
    .setDescription('Neirodialog open api')
    .setVersion('1.0')
    .addTag('neirodialog api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await findOrCreateRootUser();

  await app.listen(8080);
}
bootstrap();
