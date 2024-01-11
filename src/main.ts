import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const document_config = new DocumentBuilder()
    .setTitle('Remember Me Application Server')
    .setDescription(`에러가 생기는 경우에 연락주세요.`)
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, document_config);
  SwaggerModule.setup('docs', app, document);

  // Class Validator
  app.useGlobalPipes(new ValidationPipe());

  // Cors
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
