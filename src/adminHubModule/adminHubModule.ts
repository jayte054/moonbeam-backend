import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { CloudinaryModule } from 'src/cloudinary/cloudinaryModule';
import { ProductRepository } from 'src/productOrders/productOrderRepository/productOrderRepository';
import { AdminHubController } from './adminHubController/adminHubcontroller';
import { AdminProductRateRepository } from './adminProductRateRepository/adminProductRateRepository';
import { AdminHubService } from './adminHubService/adminHubService';
import { ProductEntity } from './productGalleryEntity/productGalleryEntity';
import { ProductRateEntity } from './productRateEntity/productRateEntity';
import { SurprisePackageEntity } from './surprisePackageEntity/surprisePackageEntity';
import { AdminProductGalleryRepository } from './adminProductGalleryRepository/adminProductGalleryRepository';
import { AdminProductDesignRateRepository } from './adminProductDesignRateRepository/adminProductDesignRateRepository';
import { BareAdminHubController } from './adminHubController/bareAdminHubcontroller';
import { SurprisePackageRepository } from './adminSurprisePackageRepository/adminSurprisePackageRepository';
import { AdminBudgetCakeRateRepository } from './adminProductRateRepository/adminBudgetCakeRateRepository copy';
import { AdminStudioEntity } from './adminStudioDetailsEntity/adminStudioDetailsEntity';
import { AdminStudioDetailsRepository } from './adminStudioRepository/adminStudioRepository';
import { ReadyToGoProductsEntity } from './rtgProductsEntity/rtgProductsEntity';
import { ReadyToGoProductsRepository } from './rtgProductsRepository/rtgProductsRepository';
import { AdminHubOrderRepository } from './adminHubOrderRepository/adminHubOrderRepository';
import { ProductsModule } from 'src/productOrders/products.module';
import { AllOrdersRepository } from 'src/productOrders/productOrderRepository/allOrdersRepository';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    // forwardRef(() => ProductsModule),
    ProductsModule,
    TypeOrmModule.forFeature([
      ProductRateEntity,
      ProductEntity,
      SurprisePackageEntity,
      AdminStudioEntity,
      ReadyToGoProductsEntity,
      ProductRepository,
      AdminBudgetCakeRateRepository,
    ]),
  ],
  providers: [
    AdminProductRateRepository,
    AdminProductGalleryRepository,
    AdminProductDesignRateRepository,
    AdminBudgetCakeRateRepository,
    SurprisePackageRepository,
    AdminStudioDetailsRepository,
    ReadyToGoProductsRepository,
    // AdminHubOrderRepository,
    AdminHubService,
  ],
  controllers: [AdminHubController, BareAdminHubController],
  exports: [],
})
export class AdminHubModule {}
