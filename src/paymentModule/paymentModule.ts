import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/authModule/authmodule";
import { CloudinaryService } from "src/cloudinary/cloudinaryService/cloudinaryService";
import { MailerModule } from "src/mailerModule/mailerModule";
import { MailerService } from "src/mailerModule/mailerService";
import { BudgetCakeOrderRepository } from "src/productOrders/productOrderRepository/budgetCakeOrderRepository";
import { CakeVariantRepository } from "src/productOrders/productOrderRepository/cakeVariantRepository";
import { CartRepository } from "src/productOrders/productOrderRepository/cartRepository";
import { ChopsOrderRepository } from "src/productOrders/productOrderRepository/chopsOrderRepository";
import { ProductRepository } from "src/productOrders/productOrderRepository/productOrderRepository";
import { SurprisePackageOrderRepository } from "src/productOrders/productOrderRepository/surprisePackageOrderRepository";
import { ProductsModule } from "src/productOrders/products.module";
import { PaymentController } from "./paymentController/paymentController";
import { PaymentEntity } from "./paymentEntity/paymentEntity";
import { PaymentRepository } from "./paymentRepository/paymentRepository";
import { PaymentService } from "./paymentService/paymentService";

@Module({
  imports: [
    AuthModule,
    MailerModule,
    ProductsModule,
    TypeOrmModule.forFeature([PaymentEntity]),
  ],
  providers: [
    PaymentEntity,
    PaymentRepository,
    CartRepository,
    ProductRepository,
    BudgetCakeOrderRepository,
    CakeVariantRepository,
    ChopsOrderRepository,
    SurprisePackageOrderRepository,
    CloudinaryService,
    PaymentService,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}