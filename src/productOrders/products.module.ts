import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { MailerModule } from 'src/mailerModule/mailerModule';
import { CloudinaryModule } from '../cloudinary/cloudinaryModule';
import { ProductController } from './productOrderController/productOrderController';
import { ProductOrderEntity } from './productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from './productOrderEntity/chopsOrderEntity';
import { ProductRepository } from './productOrderRepository/productOrderRepository';
import { ChopsOrderRepository } from './productOrderRepository/chopsOrderRepository';
import { ProductService } from './productOrderService/productOrderService';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { SurprisePackageOrderRepository } from './productOrderRepository/surprisePackageOrderRepository';
import { SurprisePackageOrderEntity } from './productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderEntity } from './productOrderEntity/budgetCakeOrderEntity';
import { BudgetCakeOrderRepository } from './productOrderRepository/budgetCakeOrderRepository';
import { CustomOrderEntity } from './productOrderEntity/customProductOrderEntity';
import { CustomCakeOrderRepository } from './productOrderRepository/CustomOrderRepository';
import { CustomPackageOrderEntity } from './productOrderEntity/customPacakgeOrderEntity';
import { CustomPackageOrderRepository } from './productOrderRepository/customPackageOrderRepository';
import { CustomChopsOrderEntity } from './productOrderEntity/customChopsEntity';
import { CustomChopsRepository } from './productOrderRepository/customChopsOrderRepository';

@Module({
  imports: [
    MailerModule,
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([
      ProductOrderEntity,
      ChopsOrderEntity,
      ProductRepository,
      SurprisePackageEntity,
      SurprisePackageOrderEntity,
      BudgetCakeOrderEntity,
      CustomOrderEntity,
      CustomPackageOrderEntity,
      CustomChopsOrderEntity,
    ]),
  ],
  providers: [
    ProductRepository,
    ChopsOrderRepository,
    SurprisePackageOrderRepository,
    BudgetCakeOrderRepository,
    CustomCakeOrderRepository,
    CustomPackageOrderRepository,
    CustomChopsRepository,
    ProductService,
  ],
  controllers: [ProductController],
})
export class ProductsModule {}
