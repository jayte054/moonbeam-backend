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
  UpdateGenericChopsOrderDto,
  UpdateSurprisePackageOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ProductRepository } from '../productOrderRepository/productOrderRepository';
import { ChopsOrderRepository } from '../productOrderRepository/chopsOrderRepository';
import { ChopsOrderType } from '../productOrderRepository/chopsOrderRepository';
import { SurprisePackageOrderRepository } from '../productOrderRepository/surprisePackageOrderRepository';
import {
  bronzePackageOrderType,
  diamondPackageOrderType,
  goldPackageOrderType,
  silverPackageOrderType,
} from 'src/types';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderRepository } from '../productOrderRepository/budgetCakeOrderRepository';
import { BudgetCakeOrderEntity } from '../productOrderEntity/budgetCakeOrderEntity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    private chopsOrderRepository: ChopsOrderRepository,
    private surprisePackageOrderRepository: SurprisePackageOrderRepository,
    private budgetCakeOrderRepository: BudgetCakeOrderRepository,
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

  async budgetCakeOrder(
    genericProductOrderDto: GenericProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<BudgetCakeOrderEntity | any> {
    return await this.budgetCakeOrderRepository.budgetCakeOrder(
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

  async silverPackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<silverPackageOrderType> {
    return await this.surprisePackageOrderRepository.silverPackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  async goldPackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<goldPackageOrderType> {
    return await this.surprisePackageOrderRepository.goldPackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  async diamondPackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<diamondPackageOrderType> {
    return await this.surprisePackageOrderRepository.diamondPackageOrder(
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

  async getChopsOrders(user: AuthEntity): Promise<ChopsOrderEntity[]> {
    return await this.chopsOrderRepository.getChopsOrders(user);
  }

  async getChopOrderWithId(
    id: string,
    user: AuthEntity,
  ): Promise<ChopsOrderEntity> {
    return await this.chopsOrderRepository.getChopOrderWithId(id, user);
  }

  async updateChopOrders(
    id: string,
    user: AuthEntity,
    updateGenericChopsOrderDto: UpdateGenericChopsOrderDto,
  ): Promise<ChopsOrderEntity> {
    return await this.chopsOrderRepository.updateChopOrders(
      id,
      user,
      updateGenericChopsOrderDto,
    );
  }

  async getSurprisePackageOrders(
    user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity[]> {
    return await this.surprisePackageOrderRepository.getSurprisePackageOrders(
      user,
    );
  }

  async getSurprisePackageOrderWithId(
    packageId: string,
    user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity> {
    return await this.surprisePackageOrderRepository.getSurprisePackageOrdersWithId(
      packageId,
      user,
    );
  }

  async updateSurprisePackageOrder(
    packageId: string,
    user: AuthEntity,
    updateSurprisePackageOrderDto: UpdateSurprisePackageOrderDto,
  ): Promise<SurprisePackageOrderEntity> {
    return await this.surprisePackageOrderRepository.updateSurprisePackageOrder(
      packageId,
      user,
      updateSurprisePackageOrderDto,
    );
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
