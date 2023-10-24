import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryModule';
import { ProductRepository } from 'src/products/productRepository/productRepository';
import { AdminHubController } from './adminHubController/adminHubcontroller';
import { AdminHubRepository } from './adminHubRepository/adminHubRepository';
import { AdminHubService } from './adminHubService/adminHubService';
import { ProductEntity } from './productEntity/productEntity';
import { ProductRateEntity } from './productRateEntity/productRateEntity';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ProductRateEntity,
      ProductEntity,
      ProductRepository,
    ]),
  ],
  providers: [AdminHubRepository, AdminHubService],
  controllers: [AdminHubController],
  exports: [],
})
export class AdminHubModule {}
