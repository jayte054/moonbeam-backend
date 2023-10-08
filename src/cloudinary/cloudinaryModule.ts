import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinaryProvider.ts/cloudinaryProvider';
import { CloudinaryService } from './cloudinaryService/cloudinaryService';
import { FileUploadMiddleware } from './fileUploadMiddleware/fileUploadMiddleware';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
