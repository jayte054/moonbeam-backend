import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { MailerService } from 'src/mailerModule/mailerService';
import { customPackageOrderType } from 'src/types';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import {
  CustomPackageOrderDto,
  RequestDto,
  UpdateCustomPackageOrderDto,
} from '../productOrderDto/productOrderDto';
import { CustomPackageOrderEntity } from '../productOrderEntity/customPacakgeOrderEntity';
import {
  CategoryType,
  OrderStatus,
} from '../ProductOrderEnum/productOrderEnum';
import { RequestRepository } from './requestRepository';

@Injectable()
export class CustomPackageOrderRepository extends Repository<CustomPackageOrderEntity> {
  private logger = new Logger('CustomPackageOrderRepository');
  constructor(
    private dataSource: DataSource,
    private mailerService: MailerService,
    @InjectRepository(RequestRepository)
    private requestRepository: RequestRepository,
  ) {
    super(CustomPackageOrderEntity, dataSource.createEntityManager());
  }

  async customPackageOrder(
    customPackageOrderDto: CustomPackageOrderDto,
    user: AuthEntity,
  ): Promise<customPackageOrderType> {
    const { orderName, item, deliveryDate, addInfo } = customPackageOrderDto;

    const order = new CustomPackageOrderEntity();
    order.orderName = orderName;
    order.item = item;
    order.category = CategoryType.customPackage;
    order.deliveryDate = deliveryDate;
    order.addInfo = addInfo;
    order.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    order.status = OrderStatus.progress;
    order.user = user;

    try {
      await order.save();
      const requestDto: RequestDto = {
        requestTitle: order.orderName,
        orderType: 'surprise package',
        category: order.category,
        content: order.item,
        deliveryDate: order.deliveryDate,
        productOrderId: order.customPackageId,
        status: order.status,
      };
      await this.requestRepository.addRequest(user, requestDto);
      this.logger.verbose(
        `custom request successfully placed by ${order.userId}`,
      );
      return {
        orderName: order.orderName,
        item: order.item,
        category: order.category,
        deliveryDate: order.deliveryDate,
        addInfo: order.addInfo,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(`failed to place custom package request`);
      throw new InternalServerErrorException(
        `failed to place custom package request`,
      );
    }
  }

  async getCustomPackageOrder(
    user: AuthEntity,
  ): Promise<CustomPackageOrderEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });

    const orders = await query.getMany();
    try {
      this.logger.verbose(
        `custom orders by user ${user.id} successfully fetched`,
      );
      return orders;
    } catch (error) {
      this.logger.error(`failed to fetch order by user ${user.id}`);
      throw new InternalServerErrorException(`failed to fetch orders`);
    }
  }

  async getCustomPackageOrderWithId(
    customPackageId: string,
    user: AuthEntity,
  ): Promise<CustomPackageOrderEntity> {
    const orderWithId = await this.findOne({
      where: {
        customPackageId,
        userId: user.id,
      },
    });

    if (!orderWithId) {
      throw new NotFoundException(`order with id ${customPackageId}`);
    }
    try {
      this.logger.verbose(
        `order with id ${customPackageId} successfully fetched`,
      );
      return orderWithId;
    } catch (error) {
      this.logger.error(
        `order with id ${customPackageId} unsuccessfully fetched`,
      );
      throw new InternalServerErrorException(
        `failed to fetch id ${customPackageId}`,
      );
    }
  }

  async updateCustomPackageOrder(
    customPackageId: string,
    user: AuthEntity,
    updateCustomPackageOrderDto: UpdateCustomPackageOrderDto,
  ): Promise<CustomPackageOrderEntity> {
    const { orderName, item, deliveryDate, addInfo } =
      updateCustomPackageOrderDto;

    const order = await this.getCustomPackageOrderWithId(customPackageId, user);

    order.orderName = orderName || order.orderName;
    order.item = item ? [item] : order.item;
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.addInfo = addInfo || order.addInfo;

    try {
      await order.save();
      await this.mailerService.updateCustomPackageOrder(user.email, order);
      this.logger.verbose(
        `user ${user.firstname} has successfully updated order with id ${customPackageId}`,
      );
      return order;
    } catch (error) {
      this.logger.error(`failed to update order with id ${customPackageId}`);
      throw new InternalServerErrorException(
        `failed to update order with id ${customPackageId}`,
      );
    }
  }
}
