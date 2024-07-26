import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';
import { ProductDesignRateEntity } from 'src/adminHubModule/ProductDesignRateEntity/ProductDesignRateEntity';
import { ProductEntity } from 'src/adminHubModule/productEntity/productEntity';
import { ProductRateEntity } from 'src/adminHubModule/productRateEntity/productRateEntity';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { PasswordResetTokenEntity } from 'src/authModule/passwordResetTokenEntity/passwordResetTokenEntity';
import { DeliveryTokenEntity } from 'src/productOrders/deliveryTokenEntity/deliveryTokenEntity';
import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from 'src/productOrders/productOrderEntity/chopsOrderEntity';
import { ProfileEntity } from 'src/profile/profileEntity/profileEntity';

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
  ],
  synchronize: process.env.TypeORM_SYNC || dbConfig.synchronize,
  migrations: ['dist/migrations/*.js'], // Specify your migration directory,
};
