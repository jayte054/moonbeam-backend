import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  CustomProductOrderDto,
  GenericProductOrderDto,
  UpdateOrderDto,
  GenericChopsOrderDto,
  SurprisePackageOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ProductRepository } from '../productOrderRepository/productOrderRepository';
import { ChopsOrderRepository } from '../productOrderRepository/chopsOrderRepository';
import { ChopsOrderType } from '../productOrderRepository/chopsOrderRepository';
import { SurprisePackageOrderRepository } from '../productOrderRepository/surprisePackageOrderRepository';
import { bronzePackageOrderType } from 'src/types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private chopsOrderRepository: ChopsOrderRepository,
    private surprisePackageOrderRepository: SurprisePackageOrderRepository,
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
    req: Request,
  ): Promise<ProductOrderEntity | any> {
    return await this.productRepository.genericProductOrder(
      genericProductOrderDto,
      user,
      req,
    );
  }

  async genericChopsOrder(
    genericChopsOderDto: GenericChopsOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<ChopsOrderType> {
    return await this.chopsOrderRepository.genericChopsOrder(
      genericChopsOderDto,
      user,
      req,
    );
  }

  async bronzePackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<bronzePackageOrderType> {
    return await this.surprisePackageOrderRepository.bronzePackageOrder(
      surprisePackageOrderDto,
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
