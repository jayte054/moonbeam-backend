import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { ProductOrderDto, UpdateOrderDto } from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { ProductLayers, ProductType } from '../ProductEnum/productEnum';
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

  async getOrderWithId(
    id: string,
    user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return this.productRepository.getOrderWithId(id, user);
  }

  async updateOrder(
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
    req?: Request,
  ): Promise<ProductOrderEntity> {
    return await this.productRepository.updateOrder(
      id,
      user,
      updateOrderDto,
      req,
    );
  }
}
