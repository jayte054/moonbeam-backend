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
import { SurprisePackageEntity } from './surprisePackageEntity/surprisePackageEntity';
import { AdminProductRepository } from './adminProductRepository/adminProductRepository';
import { AdminProductDesignRateRepository } from './adminProductDesignRateRepository/adminProductDesignRateRepository';
import { BareAdminHubController } from './adminHubController/bareAdminHubcontroller';
import { SurprisePackageRepository } from './adminSurprisePackageRepository/adminSurprisePackageRepository';
import { AdminBudgetCakeRateRepository } from './adminProductRateRepository/adminBudgetCakeRateRepository copy';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ProductRateEntity,
      ProductEntity,
      SurprisePackageEntity,
      ProductRepository,
      AdminBudgetCakeRateRepository,
    ]),
  ],
  providers: [
    AdminProductRateRepository,
    AdminProductRepository,
    AdminProductDesignRateRepository,
    AdminBudgetCakeRateRepository,
    SurprisePackageRepository,
    AdminHubService,
  ],
  controllers: [AdminHubController, BareAdminHubController],
  exports: [],
})
export class AdminHubModule {}
