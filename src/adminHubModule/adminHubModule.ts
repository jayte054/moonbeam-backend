import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryModule';
import { ProductRepository } from 'src/productOrders/productOrderRepository/productOrderRepository';
import { AdminHubController } from './adminHubController/adminHubcontroller';
import { AdminProductRateRepository } from './adminProductRateRepository/adminProductRateRepository';
import { AdminHubService } from './adminHubService/adminHubService';
import { ProductEntity } from './productEntity/productEntity';
import { ProductRateEntity } from './productRateEntity/productRateEntity';
import { AdminProductRepository } from './adminProductRepository/adminProductRepository';
import { AdminProductDesignRateRepository } from './adminProductDesignRateRepository/adminProductDesignRateRepository';
import { BareAdminHubController } from './adminHubController/bareAdminHubcontroller';

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
  providers: [
    AdminProductRateRepository,
    AdminProductRepository,
    AdminProductDesignRateRepository,
    AdminHubService,
  ],
  controllers: [AdminHubController, BareAdminHubController],
  exports: [],
})
export class AdminHubModule {}
