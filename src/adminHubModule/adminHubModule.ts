import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { ProductRepository } from 'src/products/productRepository/productRepository';
import { AdminHubController } from './adminHubController/adminHubcontroller';
import { AdminHubRepository } from './adminHubRepository/adminHubRepository';
import { AdminHubService } from './adminHubService/adminHubService';
import { ProductRateEntity } from './productRateEntity/productRateEntity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProductRateEntity, ProductRepository]),
  ],
  providers: [AdminHubRepository, AdminHubService],
  controllers: [AdminHubController],
  exports: [],
})
export class AdminHubModule {}
