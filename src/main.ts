import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module';
import {ValidationPipe} from "./pipes/validation.pipe";

async function bootstrap() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
      .setTitle("AMAZING PROJECT")
      .setVersion("1.0.0")
      .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/docs', app, document)

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser())

  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`)
  });

}
bootstrap()
