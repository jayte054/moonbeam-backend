import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinaryService/cloudinaryService';
import {CloudinaryUrlDto} from './coundinaryDto/cloudinaryUrlDto'

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
