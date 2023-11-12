import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { MailerModule } from 'src/mailerModule/mailerModule';
import { CloudinaryModule } from '../cloudinary/cloudinaryModule';
import { ProductController } from './productOrderController/productOrderController';
import { ProductOrderEntity } from './productOrderEntity/productOrderEntity';
import { ProductRepository } from './productOrderRepository/productOrderRepository';
import { ProductService } from './productOrderService/productOrderService';

@Module({
  imports: [
    MailerModule,
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([ProductOrderEntity, ProductRepository]),
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductsModule {}
