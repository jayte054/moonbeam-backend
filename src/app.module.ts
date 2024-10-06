import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './authModule/authmodule';
import { MailerModule } from './mailerModule/mailerModule';
import { typeOrmConfig } from './typeormConfig/typeorm.config';
import { ProductsModule } from './productOrders/products.module';
import { CloudinaryModule } from './cloudinary/cloudinaryModule';
import { ConfigModule } from '@nestjs/config';
import { AdminHubModule } from './adminHubModule/adminHubModule';
import { ProfileModule } from './profile/profileModule';
import { DeliveryModule } from './deliveryModule/deliveryModule';
import { PaymentModule } from './paymentModule/paymentModule';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule,
    ProductsModule,
    CloudinaryModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AdminHubModule,
    ProfileModule,
    DeliveryModule,
    PaymentModule
  ],
})
export class AppModule {}
