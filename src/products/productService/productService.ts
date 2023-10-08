import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { ProductOrderDto } from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { ProductRepository } from '../productRepository/productRepository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async createProductOrder(
    productOrderDto: ProductOrderDto,
    user: AuthEntity,
    // file: Express.Multer.File,
    req: Request,
    // deliveryDateStr: string,
  ): Promise<ProductOrderEntity | any> {
    return this.productRepository.createProductOrder(
      productOrderDto,
      user,
      req,
      //   deliveryDateStr,
    );
  }

  async getOrders(): Promise<ProductOrderEntity> {
    return await this.productRepository.getOrders();
  }
}
