import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';
import { ProductDesignRateEntity } from 'src/adminHubModule/ProductDesignRateEntity/ProductDesignRateEntity';
import { ProductEntity } from 'src/adminHubModule/productGalleryEntity/productGalleryEntity';
import { ProductRateEntity } from 'src/adminHubModule/productRateEntity/productRateEntity';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { PasswordResetTokenEntity } from 'src/authModule/passwordResetTokenEntity/passwordResetTokenEntity';
import { DeliveryTokenEntity } from 'src/productOrders/deliveryTokenEntity/deliveryTokenEntity';
import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from 'src/productOrders/productOrderEntity/chopsOrderEntity';
import { ProfileEntity } from 'src/profile/profileEntity/profileEntity';
import { SurprisePackageOrderEntity } from 'src/productOrders/productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeRateEntity } from 'src/adminHubModule/productRateEntity/budgetCakeRateEntity';
import { BudgetCakeOrderEntity } from 'src/productOrders/productOrderEntity/budgetCakeOrderEntity';
import { CakeVariantEntity } from 'src/productOrders/productOrderEntity/cakeVariantEntity';
import { CustomOrderEntity } from 'src/productOrders/productOrderEntity/customProductOrderEntity';
import { CustomPackageOrderEntity } from 'src/productOrders/productOrderEntity/customPacakgeOrderEntity';
import { CustomChopsOrderEntity } from 'src/productOrders/productOrderEntity/customChopsEntity';
import { CartEntity } from 'src/productOrders/productOrderEntity/cartEntity';
import { DeliveryAddressEntity } from 'src/deliveryModule/deliveryEntity/deliveryAddressEntity';
import { AdminStudioEntity } from 'src/adminHubModule/adminStudioDetailsEntity/adminStudioDetailsEntity';
import { DefaultStudioEntity } from 'src/deliveryModule/defaultStudioAddressEntity/defaultStudioAddressEntity';
import { PaymentEntity } from 'src/paymentModule/paymentEntity/paymentEntity';
import { RequestEntity } from 'src/productOrders/productOrderEntity/requestEntity';
import { OrderEntity } from 'src/productOrders/productOrderEntity/ordersEntity';
import { ReadyToGoProductsEntity } from 'src/adminHubModule/rtgProductsEntity/rtgProductsEntity';

const dbConfig: any | unknown = config.get('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [
    AuthEntity,
    PasswordResetTokenEntity,
    ProductOrderEntity,
    DeliveryTokenEntity,
    AdminAuthEntity,
    ProductRateEntity,
    ProductEntity,
    ProductDesignRateEntity,
    ProfileEntity,
    ChopsOrderEntity,
    SurprisePackageEntity,
    SurprisePackageOrderEntity,
    BudgetCakeRateEntity,
    BudgetCakeOrderEntity,
    CakeVariantEntity,
    CustomOrderEntity,
    CustomPackageOrderEntity,
    CustomChopsOrderEntity,
    CartEntity,
    DeliveryAddressEntity,
    AdminStudioEntity,
    DefaultStudioEntity,
    PaymentEntity,
    RequestEntity,
    OrderEntity,
    ReadyToGoProductsEntity,
  ],
  synchronize: process.env.TypeORM_SYNC || dbConfig.synchronize,
  migrations: ['dist/migrations/*.js'], // Specify your migration directory,
};
