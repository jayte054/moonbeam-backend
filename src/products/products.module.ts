import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/authModule/authmodule';
import { CloudinaryModule } from '../cloudinary/cloudinaryModule';
import { ProductController } from './productController/productController';
import { ProductOrderEntity } from './productEntity/productOrderEntity';
import { ProductRepository } from './productRepository/productRepository';
import { ProductService } from './productService/productService';

@Module({
  imports: [
    CloudinaryModule,
    AuthModule,
    TypeOrmModule.forFeature([ProductOrderEntity, ProductRepository]),
  ],
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductsModule {}
