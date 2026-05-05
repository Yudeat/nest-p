import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { loggerConfig } from './Logger/log';
import { join } from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(loggerConfig);
  app.useStaticAssets(join(__dirname,'..','..','uploads')),{
    prefix:'/uploads',
  
  };
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
