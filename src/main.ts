import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import { loggerConfig } from './Logger/log';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(loggerConfig);
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
