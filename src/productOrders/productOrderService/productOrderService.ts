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
  CustomPackageOrderDto,
  UpdateCustomPackageOrderDto,
  CreateChopsOrderDto,
  UpdateCustomChopOrderDto,
  CartDto,
  FoilCakeDto,
  RequestDto,
  OrderDto,
  RtgOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ProductRepository } from '../productOrderRepository/productOrderRepository';
import { ChopsOrderRepository } from '../productOrderRepository/chopsOrderRepository';
import { ChopsOrderType } from '../productOrderRepository/chopsOrderRepository';
import { SurprisePackageOrderRepository } from '../productOrderRepository/surprisePackageOrderRepository';
import {
  bronzePackageOrderType,
  CartObject,
  chopsOrderType,
  diamondPackageOrderType,
  VariantCakeObject,
  goldPackageOrderType,
  silverPackageOrderType,
  RequestObject,
  OrderObject,
  RtgOrderObject,
} from 'src/types';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderRepository } from '../productOrderRepository/budgetCakeOrderRepository';
import { BudgetCakeOrderEntity } from '../productOrderEntity/budgetCakeOrderEntity';
import { CustomCakeOrderRepository } from '../productOrderRepository/CustomOrderRepository';
import { CustomOrderEntity } from '../productOrderEntity/customProductOrderEntity';
import { CustomPackageOrderRepository } from '../productOrderRepository/customPackageOrderRepository';
import { customPackageOrderType } from 'src/types';
import { CustomPackageOrderEntity } from '../productOrderEntity/customPacakgeOrderEntity';
import { CustomChopsRepository } from '../productOrderRepository/customChopsOrderRepository';
import { CustomChopsOrderEntity } from '../productOrderEntity/customChopsEntity';
import { CartRepository } from '../productOrderRepository/cartRepository';
import { CartEntity } from '../productOrderEntity/cartEntity';
import { CakeVariantRepository } from '../productOrderRepository/cakeVariantRepository';
import { CakeVariantEntity } from '../productOrderEntity/cakeVariantEntity';
import { RequestRepository } from '../productOrderRepository/requestRepository';
import { RequestEntity } from '../productOrderEntity/requestEntity';
import { OrderEntity } from '../productOrderEntity/ordersEntity';
import { OrderRepository } from '../productOrderRepository/ordersRepository';
import { RtgOrderRepository } from '../productOrderRepository/rtgOrderRepository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(ChopsOrderRepository)
    private chopsOrderRepository: ChopsOrderRepository,
    @InjectRepository(SurprisePackageOrderRepository)
    private surprisePackageOrderRepository: SurprisePackageOrderRepository,
    @InjectRepository(BudgetCakeOrderRepository)
    private budgetCakeOrderRepository: BudgetCakeOrderRepository,
    @InjectRepository(CustomCakeOrderRepository)
    private customCakeOrderRepository: CustomCakeOrderRepository,
    @InjectRepository(CustomPackageOrderRepository)
    private customPackageOrderRepository: CustomPackageOrderRepository,
    @InjectRepository(CustomChopsRepository)
    private customChopsRepository: CustomChopsRepository,
    @InjectRepository(CakeVariantRepository)
    private cakeVariantRepository: CakeVariantRepository,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(RtgOrderRepository)
    private rtgOrderRepository: RtgOrderRepository,
  ) {}

  async createCustomProductOrder(
    customProductOrderDto: CustomProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<CustomOrderEntity | any> {
    return this.customCakeOrderRepository.createCustomProductOrder(
      customProductOrderDto,
      user,
      req,
    );
  }

  async customPackageOrder(
    customPackageOrderDto: CustomPackageOrderDto,
    user: AuthEntity,
  ): Promise<customPackageOrderType> {
    return await this.customPackageOrderRepository.customPackageOrder(
      customPackageOrderDto,
      user,
    );
  }

  async customChopsOrder(
    createChopsOrderDto: CreateChopsOrderDto,
    user: AuthEntity,
  ): Promise<chopsOrderType> {
    return await this.customChopsRepository.customChopsOrder(
      createChopsOrderDto,
      user,
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

  async foilCakeOrder(
    foilCakeDto: FoilCakeDto,
    user: AuthEntity,
  ): Promise<VariantCakeObject> {
    return await this.cakeVariantRepository.foilCakeOrder(foilCakeDto, user);
  }

  async cakeParfaitOrder(
    foilCakeDto: FoilCakeDto,
    user: AuthEntity,
  ): Promise<VariantCakeObject> {
    return await this.cakeVariantRepository.cakeParfaitOrder(foilCakeDto, user);
  }

  async createRtgOrder(
    user: AuthEntity,
    rtgOrderDto:RtgOrderDto,
  ): Promise<RtgOrderObject> {
    return await this.rtgOrderRepository.createRtgOrder(user, rtgOrderDto)
  }

  async addToCart(user: AuthEntity, cartDto: CartDto): Promise<CartObject> {
    return await this.cartRepository.addToCart(user, cartDto);
  }

  async addRequest(user: AuthEntity, requestDto: RequestDto): Promise<RequestObject>  {
    return await this.requestRepository.addRequest(user, requestDto)
  }

  async createOrder (user: AuthEntity, orderDto: OrderDto): Promise<OrderObject> {
    return await this.orderRepository.createOrder(user, orderDto)
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

  async getCustomChopsOrder(
    user: AuthEntity,
  ): Promise<CustomChopsOrderEntity[]> {
    return await this.customChopsRepository.getCustomChopsOrder(user);
  }

  async getCustomPackageOrder(
    user: AuthEntity,
  ): Promise<CustomPackageOrderEntity[]> {
    return await this.customPackageOrderRepository.getCustomPackageOrder(user);
  }

  async fetchOrders (user: AuthEntity): Promise<OrderEntity[]> {
    return await this.orderRepository.fetchOrders(user)
  }

  async getCustomChopsOrderWithId(
    chopsId: string,
    user: AuthEntity,
  ): Promise<CustomChopsOrderEntity> {
    return await this.customChopsRepository.getCustomChopOrderWithId(
      chopsId,
      user,
    );
  }

  async getCustomPackageOrderWithId(
    customPackageId: string,
    user: AuthEntity,
  ): Promise<CustomPackageOrderEntity> {
    return await this.customPackageOrderRepository.getCustomPackageOrderWithId(
      customPackageId,
      user,
    );
  }

  async fetchOrdersWithId (user: AuthEntity, orderId: string): Promise<OrderEntity> {
    return await this.orderRepository.fetchOrderWithId(user, orderId)
  }

  async getCakeVaraintOrders(user: AuthEntity): Promise<CakeVariantEntity[]> {
    return await this.cakeVariantRepository.getCakeVariantOrders(user);
  }

  async updateCustomPackageOrder(
    customPackageId: string,
    user: AuthEntity,
    updateCustomPackageOrderDto: UpdateCustomPackageOrderDto,
  ): Promise<CustomPackageOrderEntity> {
    return await this.customPackageOrderRepository.updateCustomPackageOrder(
      customPackageId,
      user,
      updateCustomPackageOrderDto,
    );
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

  async fetchCartItems(user: AuthEntity): Promise<CartEntity[]> {
    return await this.cartRepository.fetchCartItems(user);
  }

  async fetchRequests(user: AuthEntity): Promise<RequestEntity[]> {
    return await this.requestRepository.fetchRequests(user)
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

  async updateCustomChopsOrder(
    updateCustomChopsOrder: UpdateCustomChopOrderDto,
    user: AuthEntity,
    chopsId: string,
  ): Promise<CustomChopsOrderEntity> {
    return await this.customChopsRepository.updateCustomChopOrder(
      updateCustomChopsOrder,
      user,
      chopsId,
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
    req: Request,
    file: Express.Multer.File
  ): Promise<ProductOrderEntity> {
    return await this.productRepository.updateOrder(
      id,
      user,
      updateOrderDto,
      req,
      file
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

  async _deleteOrder (user: AuthEntity, orderId: string): Promise<string> {
    return await this.orderRepository.deleteOrder(user, orderId)
  }

  async deleteOrder(id: string, user: AuthEntity): Promise<string> {
    return await this.productRepository.deleteOrder(id, user);
  }

  async deleteCartItem(user: AuthEntity, itemId: string): Promise<string> {
    return await this.cartRepository.deleteCartItem(user, itemId);
  }

  async deleteRequest(user: AuthEntity, requestId: string): Promise<string> {
    return await this.requestRepository.deleteRequests(user, requestId)
  }
}
