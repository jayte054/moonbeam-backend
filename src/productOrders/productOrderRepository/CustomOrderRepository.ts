import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { DataSource, Repository } from 'typeorm';
import {
  CustomProductOrderDto,
  UpdateOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import {
  OrderStatus,
} from '../ProductOrderEnum/productOrderEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { CloudinaryUrlDto } from '../../cloudinary/coundinaryDto/cloudinaryUrlDto';
import { CustomOrderEntity } from '../productOrderEntity/customProductOrderEntity';

@Injectable()
export class CustomCakeOrderRepository extends Repository<CustomOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
  ) {
    super(CustomOrderEntity, dataSource.createEntityManager());
  }

  //to do: modify customOrder so that its flexible for clients to make particular types of order
  async createCustomProductOrder(
    customProductOrderDto: CustomProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<CustomOrderEntity | any> {
    console.log('hereeee');
    const {
      orderName,
      deliveryDate,
      description,
      productFlavour,
      designCovering,
      layers,
      inches,
      type,
    } = customProductOrderDto;

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new CustomOrderEntity();

    order.customCakeId = uuid();
    order.orderName = orderName;
    order.type = type;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.productFlavour = productFlavour;
    order.designCovering = designCovering;
    order.layers = layers;
    order.inches = inches;
    order.status = OrderStatus.progress;
    order.description = description;
    order.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    order.deliveryDate = deliveryDate;
    order.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    order.user = user;

    try {
      await order.save();
        await this.mailerService.customOrderMail(user.email, order);
      this.logger.verbose(
        `user ${user} has successfully requested a custom order ${order.customCakeId}`,
      );
    } catch (error) {
      this.logger.error('error placing order');
      throw new InternalServerErrorException(
        'error placing custom order request, please try again later',
      );
    }

    return {
      id: order.customCakeId,
      orderName: order.orderName,
      type: order.type,
      inches: order.inches,
      layers: order.layers,
      design: order.designCovering,
      imageUrl: order.imageUrl,
      orderDate: order.orderDate,
      price: order.price,
      deliveryDate: order.deliveryDate,
      userId: order.user.id,
      description: order.description,
      status: order.status,
    };
  }

  async getOrders(user: AuthEntity): Promise<CustomOrderEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });
    console.log(user);
    const orders = await query.getMany();
    console.log(orders);
    try {
      this.logger.verbose(
        `user with id ${user.id} orders fetched successfully`,
      );
    return orders;
    } catch (error) {
      this.logger.error(`orders for user ${user.id} not found`);
      throw new NotFoundException(`orders for user ${user.id} not found`);
    }

  }

  async getOrderWithId(
    customCakeId: string,
    user: AuthEntity,
  ): Promise<CustomOrderEntity | any> {
    const orderWithId = await this.findOne({
      where: {
        customCakeId: customCakeId,
        userId: user.id,
      },
    });

    if (!orderWithId) {
      throw new NotFoundException(`order with id ${customCakeId} not found`);
    }
    try {
      this.logger.verbose(
        `user ${user.firstname} successfully fetched order with id ${customCakeId}`,
      );
      return orderWithId;
    } catch (error) {
      this.logger.error(
        `User with ${user.firstname} failed to get order with id ${customCakeId}`,
      );
      throw new InternalServerErrorException(
        `failed to get order with id ${customCakeId}`,
      );
    }
  }

  async updateOrder(
    customCakeId: string,
    user: AuthEntity,
    updateOrderDto?: UpdateOrderDto,
    req?: Request,
  ): Promise<CustomOrderEntity | any> {
    const {
      type,
      layers,
      deliveryDate,
      inches,
      description,
      orderName,
      file,
      productFlavour,
      designCovering,
    } = updateOrderDto;

    const order = await this.getOrderWithId(customCakeId, user);

    if (file) {
      const newImage = await this.cloudinaryService.uploadImage(req.file);

      if (order.imageUrl) {
        const oldPublicId = this.extractPublicId(order.imageUrl);
        console.log('old', oldPublicId);
        await this.cloudinaryService.deleteImage(oldPublicId);
      }
      order.imageUrl = newImage.secure_url;
    }

    order.orderName = orderName || order.orderName;
    order.type = type || order.type;
    order.layers = Number(layers);
    order.inches = Number(inches);
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.description = description || order.description;
    order.productFlavour = productFlavour || order.productFlavour;
    order.designCovering = designCovering || order.designCovering;

    try {
      await order.save();
      await this.mailerService.updateOrderMail(user.email, order);
      this.logger.verbose(
        `User ${user.firstname} has successfully updated order with id ${customCakeId}`,
      );
    } catch (error) {
      this.logger.error(
        `User ${user.firstname} failed to update order with id  ${customCakeId}`,
      );
      console.log(error);
      throw new InternalServerErrorException(
        `failed to update order with id ${customCakeId}`,
      );
    }
    return order;
  }
  private extractPublicId(imageUrl: string): string {
    // Extract the public_id from the imageUrl
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }

  async cancelOrder(
    customCakeId: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<CustomOrderEntity | string> {
    const { deliveryDate } = updateOrderDto;
    const order = await this.getOrderWithId(customCakeId, user);

    order.status = OrderStatus.cancel;
    order.deliveryDate = deliveryDate;

    try {
      if (order.status === OrderStatus.cancel) {
        return order;
      } else {
        await order.save();
        await this.mailerService.cancelOrderMail(user.email, order);
        this.logger.verbose(`order with id ${customCakeId} has been canceled`);
      }
    } catch (error) {
      throw new NotFoundException(`order with id ${customCakeId} not found`);
    }
    if (order.status === OrderStatus.cancel) {
      return `order with id ${customCakeId} has already been canceled`;
    }
    return `order with ${customCakeId} has been canceled`;
  }

  async orderDelivered(
    customCakeId: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ProductOrderEntity | string> {
    const { token } = updateOrderDto;

    const order = await this.getOrderWithId(customCakeId, user);

    order.token = token;
    order.status = OrderStatus.delivered;

    try {
      await order.save();
      await this.mailerService.orderDeliveryMail(user.email, order);
      this.logger.verbose(`order with ${customCakeId} has been delivered`);
    } catch (error) {
      this.logger.error(`token not valid`);
      throw new NotFoundException(`token ${token} not valid`);
    }
    if (order.status === OrderStatus.delivered) {
      return `order with id ${customCakeId} has already been delivered`;
    }
    return `order with ${customCakeId} has been delivered`;
  }

  async deleteOrder(customCakeId: string, user: AuthEntity): Promise<string> {
    const result = await this.delete({
      customCakeId,
      userId: user.id,
    });

    if (!result) {
      throw new NotFoundException(`${customCakeId} not found`);
    }

    try {
      this.logger.verbose(
        `order with id ${customCakeId} has been successfully deleted`,
      );
      return `order with ${customCakeId}, successfully deleted`;
    } catch (error) {
      this.logger.error(
        `User ${user} encountered an error deleting order with ${customCakeId}`,
      );
      throw new InternalServerErrorException(
        `error deleting order with id ${customCakeId}`,
      );
    }
  }
}