import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { RequestObject } from 'src/types';
import { DataSource, Repository } from 'typeorm';
import { RequestDto } from '../productOrderDto/productOrderDto';
import { RequestEntity } from '../productOrderEntity/requestEntity';
import { CategoryType } from '../ProductOrderEnum/productOrderEnum';

@Injectable()
export class RequestRepository extends Repository<RequestEntity> {
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    super(RequestEntity, dataSource.createEntityManager());
  }

  addRequest = async (
    user: AuthEntity,
    requestDto: RequestDto,
  ): Promise<RequestObject> => {
    const {
      requestTitle,
      orderType,
      category,
      quantity,
      imageUrl,
      deliveryDate,
      productOrderId,
      content,
      status,
    } = requestDto;

    const order = new RequestEntity();

    order.requestTitle = requestTitle;
    order.orderType = orderType;
    order.category = category;
    order.quantity = quantity || '1';
    order.content = content;
    order.imageUrl = imageUrl;
    order.deliveryDate = deliveryDate;
    order.productOrderId = productOrderId;
    order.status = status;
    order.user = user;

    try {
      await order.save();
      this.logger.verbose(
        `order request with id ${order.requestId} successfully added`,
      );
      return {
        requestId: order.requestId,
        requestTitle: order.requestTitle,
        orderType: order.orderType,
        content: order.content,
        quantity: order.quantity,
        deliveryDate: order.deliveryDate,
        status: order.status,
        productOrderId: order.productOrderId,
        userId: user.id,
      };
    } catch (error) {
      this.logger.error('failed to add request ');
      throw new InternalServerErrorException('failed to add request');
    }
  };

  fetchRequests = async (user: AuthEntity): Promise<RequestEntity[]> => {
    const query = this.createQueryBuilder('requestTitle');
    query.where(`requestTitle.userId = :userId`, { userId: user.id });

    try {
      const requests = await query.getMany();
      if (!requests) {
        this.logger.debug(`there are no requests to fetch for user ${user.id}`);
        throw new NotFoundException('no requests to fetch');
      }
      this.logger.verbose(`requests for user ${user.id} successfully fetched`);
      return requests;
    } catch (error) {
      this.logger.error(`failed to fetch requests for user ${user.id}`);
      throw new InternalServerErrorException('failed to fetch requests');
    }
  };

  deleteRequests = async (
    user: AuthEntity,
    requestId: string,
  ): Promise<string> => {
    try {
      const orderRequest = await this.delete({
        requestId,
        userId: user.id,
      });
      if (!orderRequest) {
        this.logger.debug(`request with requestId ${requestId} not found`);
        throw new NotFoundException('order Request not found');
      }
      this.logger.verbose(`request with id ${requestId} successfully deleted`);
      return `order request with id ${requestId} successfully deleted`;
    } catch (error) {
      this.logger.error(`failed to delete requests`);
      throw new InternalServerErrorException(`failed to delete requests`);
    }
  };
}
