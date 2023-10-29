import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  CustomProductOrderDto,
  GenericProductOrderDto,
  UpdateOrderDto,
} from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { ProductRepository } from '../productRepository/productRepository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  async createCustomProductOrder(
    customProductOrderDto: CustomProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<ProductOrderEntity | any> {
    return this.productRepository.createCustomProductOrder(
      customProductOrderDto,
      user,
      req,
    );
  }

  async genericProductOrder(
    genericProductOrderDto: GenericProductOrderDto,
    user: AuthEntity,
  ): Promise<ProductOrderEntity | any> {
    return await this.productRepository.genericProductOrder(
      genericProductOrderDto,
      user,
    );
  }

  async getOrders(user: AuthEntity): Promise<ProductOrderEntity[]> {
    return await this.productRepository.getOrders(user);
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

  async cancelOrder(
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ProductOrderEntity | any> {
    return await this.productRepository.cancelOrder(id, user, updateOrderDto);
  }

  async orderDelivered(
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ProductOrderEntity | string> {
    return await this.productRepository.orderDelivered(
      id,
      user,
      updateOrderDto,
    );
  }

  async deleteOrder(id: string, user: AuthEntity): Promise<string> {
    return await this.productRepository.deleteOrder(id, user);
  }
}
