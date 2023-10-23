import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app: any = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('server.port', 3005);
  await app.listen(port);
  logger.log('application is running on port;', port);
}
bootstrap();
