import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

// Optionally, load configuration files based on your environment (development, production, etc.)
// const nodeEnv = process.env.NODE_ENV || 'development';
// config.loadFile(`./config/${nodeEnv}.json`);

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app: any = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('server.port', 3005);
  await app.listen(port);
  logger.log('application is running on port;', port);
}
bootstrap();
