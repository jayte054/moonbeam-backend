import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { OrderObject } from 'src/types';
import { DataSource, Repository } from 'typeorm';
import { OrderDto } from '../productOrderDto/productOrderDto';
import { OrderEntity } from '../productOrderEntity/ordersEntity';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  private logger = new Logger('OrderRepository');
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }

  createOrder = async (
    user: AuthEntity,
    orderDto: OrderDto,
  ): Promise<OrderObject> => {
    const { orderName, imageUrl, quantity, content, deliveryDate, price } =
      orderDto;

    const newOrder = new OrderEntity();
    newOrder.orderName = orderName;
    newOrder.imageUrl = imageUrl;
    newOrder.quantity = quantity;
    newOrder.content = content;
    newOrder.price = price;
    newOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    newOrder.deliveryDate = deliveryDate;
    newOrder.userId = user.id;
    console.log(newOrder);

    try {
      await newOrder.save();
      this.logger.verbose(
        `order with id ${newOrder.orderId} saved successfully`,
      );
      return {
        orderId: newOrder.orderId,
        orderName: newOrder.orderName,
        orderDate: newOrder.orderDate,
        imageUrl: newOrder.imageUrl,
        quantity: newOrder.quantity,
        price: newOrder.price,
        content: newOrder.content,
        deliveryDate: newOrder.deliveryDate,
        userId: user.id,
      };
    } catch (error) {
      console.log(error);
      this.logger.error('failed to complete order');
      throw new InternalServerErrorException('failed to complete order');
    }
  };

  fetchOrders = async (user: AuthEntity): Promise<OrderEntity[]> => {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });

    try {
      const orders = await query.getMany();
      if (!orders) {
        this.logger.debug('no orders found');
        throw new NotFoundException('no orders found for user', user.id);
      }
      return orders;
    } catch (error) {
      this.logger.error(`failed to fetch orders for user ${user.id}`);
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };

  _fetchOrders = async (userId: string): Promise<OrderEntity[]> => {
    console.log(userId);
    const query = this.createQueryBuilder('order');
    query.where('order.userId = :userId', { userId });

    try {
      const orders = await query.getMany();
      if (!orders) {
        this.logger.debug('no orders found');
        throw new NotFoundException('no orders found ');
      }
      return orders;
    } catch (error) {
      this.logger.error(`failed to fetch orders `);
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };

  fetchOrderWithId = async (
    user: AuthEntity,
    orderId: string,
  ): Promise<OrderEntity> => {
    try {
      const order = await this.findOne({
        where: { orderId, userId: user.id },
      });

      if (!order) {
        throw new NotFoundException(`order with id ${orderId} not found`);
      }

      this.logger.verbose(`order with id ${orderId} successfully fetched`);
      return order;
    } catch (error) {
      this.logger.error(`failed to fetch order with id ${orderId}`);
      throw new InternalServerErrorException('failed to fetch order');
    }
  };

  deleteOrder = async (user: AuthEntity, orderId: string): Promise<string> => {
    try {
      const order = await this.delete({
        orderId,
        userId: user.id,
      });

      if (!order) {
        this.logger.debug(`order with id ${orderId} not found`);
        throw new NotFoundException('order not found');
      }
      this.logger.verbose(`er with id ${orderId} successfully deleted`);
      return `order with id ${orderId} not found`;
    } catch (error) {
      this.logger.error(`failed to fetch order with id ${orderId}`);
      throw new InternalServerErrorException('failed to delete order');
    }
  };
}
