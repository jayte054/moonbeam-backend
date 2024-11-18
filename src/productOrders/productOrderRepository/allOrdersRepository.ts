import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BudgetCakeOrderRepository } from './budgetCakeOrderRepository';
import { CakeVariantRepository } from './cakeVariantRepository';
import { ChopsOrderRepository } from './chopsOrderRepository';
import { CustomCakeOrderRepository } from './CustomOrderRepository';
import { CustomPackageOrderRepository } from './customPackageOrderRepository';
import { OrderRepository } from './ordersRepository';
import { ProductRepository } from './productOrderRepository';
import { RequestRepository } from './requestRepository';
import { RtgOrderRepository } from './rtgOrderRepository';
import { SurprisePackageOrderRepository } from './surprisePackageOrderRepository';
import { AllOrdersDto, AllOrdersObject, PaidOrdersDto } from 'src/types';

@Injectable()
export class AllOrdersRepository {
  private logger = new Logger('AllOrdersRepository');
  constructor(
    @InjectRepository(BudgetCakeOrderRepository)
    private budgetCakeOrderRepository: BudgetCakeOrderRepository,
    @InjectRepository(CakeVariantRepository)
    private cakeVariantRepository: CakeVariantRepository,
    @InjectRepository(ChopsOrderRepository)
    private chopsOrderRepository: ChopsOrderRepository,
    @InjectRepository(CustomCakeOrderRepository)
    private customCakeOrderRepository: CustomCakeOrderRepository,
    @InjectRepository(CustomPackageOrderRepository)
    private customPackageOrderRepository: CustomPackageOrderRepository,
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
    @InjectRepository(RtgOrderRepository)
    private rtgOrderRepository: RtgOrderRepository,
    @InjectRepository(SurprisePackageOrderRepository)
    private surprisePackageOrderRepository: SurprisePackageOrderRepository,
  ) {}

  getAllUserOrders = async (userId: string): Promise<AllOrdersDto[]> => {
    try {
      const [
        budgetCakeOrders,
        cakeVariantOrders,
        chopsOrders,
        customCakeOrders,
        customPackageOrders,
        products,
        chopRequestOrders,
        rtgOrders,
        packageOrders,
      ] = await Promise.all([
        this.budgetCakeOrderRepository.find({ where: { userId } }),
        this.cakeVariantRepository.find({ where: { userId } }),
        this.chopsOrderRepository.find({ where: { userId } }),
        this.customCakeOrderRepository.find({ where: { userId } }),
        this.customPackageOrderRepository.find({ where: { userId } }),
        this.productRepository.find({ where: { userId } }),
        this.requestRepository.find({ where: { userId } }),
        this.rtgOrderRepository.find({ where: { userId } }),
        this.surprisePackageOrderRepository.find({ where: { userId } }),
      ]);

      const formattedBudgetCakeOrders = budgetCakeOrders.map((order) => ({
        id: order.budgetCakeId,
        orderType: order.type,
        date: order.date,
        amount: order.price,
        status: order.status,
      }));

      const formattedChopOrders = chopsOrders.map((order) => ({
        id: order.id,
        orderType: order.type,
        date: order.date,
        amount: order.price,
        status: order.status,
      }));

      const formattedCakeVariantOrders = cakeVariantOrders.map((order) => ({
        id: order.variantId,
        orderType: order.type,
        date: order.orderDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedCustomCakeOrders = customCakeOrders.map((order) => ({
        id: order.customCakeId,
        orderType: order.type,
        date: order.date,
        amount: order.price,
        status: order.status,
      }));

      const formattedCustomPackageOrders = customPackageOrders.map((order) => ({
        id: order.customPackageId,
        orderType: 'custom package',
        date: order.orderDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedProductsOrders = products.map((order) => ({
        id: order.id,
        orderType: order.type,
        date: order.date,
        amount: order.price,
        status: order.status,
      }));

      const formattedChopRequestOrders = chopRequestOrders.map((order) => ({
        id: order.requestId,
        orderType: order.orderType,
        date: order.deliveryDate,
        amount: 'null',
        status: order.status,
      }));

      const formattedRtgOrders = rtgOrders.map((order) => ({
        id: order.rtgOrderId,
        orderType: order.orderType,
        date: order.orderDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedPackageOrders = packageOrders.map((order) => ({
        id: order.packageId,
        orderType:
          order.bronzePackage.toString() ||
          order.silverPackage.toString() ||
          order.goldPackage.toString() ||
          order.diamondPackage.toString(),
        date: order.orderDate,
        amount: order.price,
        status: order.status,
      }));

      const allOrders = [
        ...formattedBudgetCakeOrders,
        ...formattedCakeVariantOrders,
        ...formattedChopOrders,
        ...formattedChopRequestOrders,
        ...formattedCustomCakeOrders,
        ...formattedCustomPackageOrders,
        ...formattedPackageOrders,
        ...formattedProductsOrders,
        ...formattedRtgOrders,
      ];
      this.logger.verbose('successfully fetched all orders');
      return allOrders;
    } catch (error) {
      this.logger.error('failed to fetch orders');
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };

  allPaidUserOrders = async (
    userId: string,
  ): Promise<PaidOrdersDto[] | string> => {
    try {
      //   const paidOrders = await this.orderRepository.find({ where: { userId } });

      const paidOrders = await this.orderRepository._fetchOrders(userId);
      if (!paidOrders) {
        return 'user has no completed orders';
      }
      const orders: PaidOrdersDto[] = paidOrders.map((orders) => ({
        id: orders.orderId,
        orderName: orders.orderName,
        orderType: orders.content,
        category: orders.category,
        date: orders.orderDate,
        amount: orders.price,
        status: 'paid',
        deliveryStatus: orders.deliveryStatus,
        deliveryDate: orders.deliveryDate,
      }));
      this.logger.verbose(`fetched paid orders for id ${userId}`);
      return orders;
    } catch (error) {
      this.logger.error('failed to retrieve orders');
      throw new InternalServerErrorException();
    }
  };

  getAllOrders = async (): Promise<AllOrdersObject> => {
    try {
      const [
        budgetCakeOrders,
        cakeVariantOrders,
        chopsOrders,
        customCakeOrders,
        customPackageOrders,
        products,
        chopRequestOrders,
        rtgOrders,
        packageOrders,
      ] = await Promise.all([
        this.budgetCakeOrderRepository.find(),
        this.cakeVariantRepository.find(),
        this.chopsOrderRepository.find(),
        this.customCakeOrderRepository.find(),
        this.customPackageOrderRepository.find(),
        this.productRepository.find(),
        this.requestRepository.find(),
        this.rtgOrderRepository.find(),
        this.surprisePackageOrderRepository.find(),
      ]);

      const formattedBudgetCakeOrders: AllOrdersDto[] = budgetCakeOrders.map(
        (order) => ({
          id: order.budgetCakeId,
          orderType: order.type,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          amount: order.price,
          status: order.status,
        }),
      );

      const formattedChopOrders: AllOrdersDto[] = chopsOrders.map((order) => ({
        id: order.id,
        orderType: order.type,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedCakeVariantOrders: AllOrdersDto[] = cakeVariantOrders.map(
        (order) => ({
          id: order.variantId,
          orderType: order.type,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          amount: order.price,
          status: order.status,
        }),
      );

      const formattedCustomCakeOrders: AllOrdersDto[] = customCakeOrders.map(
        (order) => ({
          id: order.customCakeId,
          orderType: order.type,
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          amount: order.price,
          status: order.status,
        }),
      );

      const formattedCustomPackageOrders: AllOrdersDto[] =
        customPackageOrders.map((order) => ({
          id: order.customPackageId,
          orderType: 'custom package',
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          amount: order.price,
          status: order.status,
        }));

      const formattedProductsOrders: AllOrdersDto[] = products.map((order) => ({
        id: order.id,
        orderType: order.type,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedChopRequestOrders: AllOrdersDto[] = chopRequestOrders.map(
        (order) => ({
          id: order.requestId,
          orderType: order.orderType,
          deliveryDate: order.deliveryDate,
          amount: 'null',
          status: order.status,
        }),
      );

      const formattedRtgOrders: AllOrdersDto[] = rtgOrders.map((order) => ({
        id: order.rtgOrderId,
        orderType: order.orderType,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        amount: order.price,
        status: order.status,
      }));

      const formattedPackageOrders: AllOrdersDto[] = packageOrders.map(
        (order) => ({
          id: order.packageId,
          orderType:
            order.bronzePackage.toString() ||
            order.silverPackage.toString() ||
            order.goldPackage.toString() ||
            order.diamondPackage.toString(),
          orderDate: order.orderDate,
          deliveryDate: order.deliveryDate,
          amount: order.price,
          status: order.status,
        }),
      );

      //   const allOrders = [
      //     ...formattedBudgetCakeOrders,
      //     ...formattedCakeVariantOrders,
      //     ...formattedChopOrders,
      //     ...formattedChopRequestOrders,
      //     ...formattedCustomCakeOrders,
      //     ...formattedCustomPackageOrders,
      //     ...formattedPackageOrders,
      //     ...formattedProductsOrders,
      //     ...formattedRtgOrders,
      //   ];

      const _allOrders: AllOrdersObject = {
        budgetCake: formattedBudgetCakeOrders,
        cakeVariant: formattedCakeVariantOrders,
        chopOrders: formattedChopOrders,
        chopRequestOrders: formattedChopRequestOrders,
        customCakeOrders: formattedCustomCakeOrders,
        customPackageOrders: formattedCustomPackageOrders,
        packageOrders: formattedPackageOrders,
        customProductOrders: formattedProductsOrders,
        rtgOrders: formattedRtgOrders,
      };

      this.logger.verbose('successfully fetched all orders');
      return _allOrders;
    } catch (error) {
      this.logger.error('failed to fetch orders');
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };

  allPaidOrders = async (): Promise<PaidOrdersDto[] | any> => {
    try {
      const paidOrders = await this.orderRepository.find();

      if (!paidOrders) {
        return 'user has no completed orders';
      }
      const orders: PaidOrdersDto[] = paidOrders.map((orders) => ({
        id: orders.orderId,
        orderName: orders.orderName,
        orderType: orders.content,
        category: orders.category,
        date: orders.orderDate,
        amount: orders.price,
        deliveryStatus: orders.deliveryStatus,
        deliveryDate: orders.deliveryDate,
        status: 'paid',
      }));
      this.logger.verbose(`fetched paid orders`);
      return orders;
    } catch (error) {
      this.logger.error('failed to retrieve orders');
      throw new InternalServerErrorException();
    }
  };
}
