import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { ProductOrderDto, UpdateOrderDto } from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { ProductLayers, ProductType } from '../ProductEnum/productEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { Type } from 'typescript';
import { AuthDto } from 'src/authModule/authDto/authDto';

@Injectable()
export class ProductRepository extends Repository<ProductOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ProductOrderEntity, dataSource.createEntityManager());
  }
  async createProductOrder(
    productOrderDto: ProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<ProductOrderEntity | any> {
    console.log('hereeee');
    const { orderName, deliveryDate } = productOrderDto;

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new ProductOrderEntity();
    order.id = uuid();
    order.orderName = orderName;
    order.type = ProductType.Birthday;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.layers = ProductLayers.one;
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
      // await this.cloudinaryService.uploadImage(req.file);
      await order.save();
      this.logger.verbose(
        `user ${user} has successfully placed an order ${order.id}`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error('error placing order');
      throw new InternalServerErrorException(
        'error creating order, please try again later',
      );
    }

    return {
      id: order.id,
      orderName: order.orderName,
      type: order.type,
      layers: order.layers,
      imageUrl: order.imageUrl,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      userId: order.user.id,
    };
  }

  async getOrders(): Promise<ProductOrderEntity> {
    const options: FindOneOptions<ProductOrderEntity> = {};

    const orders: any = await this.find(options);
    if (!orders) {
      this.logger.error('orders not found');
      throw new NotFoundException('orders not found');
    }
    this.logger.verbose('orders fetched successfully');
    return orders;
  }

  async getOrderWithId(
    id: string,
    user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    const orderWithId = await this.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!orderWithId) {
      throw new NotFoundException(`order with id ${id} not found`);
    }
    try {
      this.logger.verbose(
        `user ${user.firstname} successfully fetched order with id ${id}`,
      );
      return orderWithId;
    } catch (error) {
      this.logger.error(
        `User with ${user.firstname} failed to get order with id ${id}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateOrder(
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
    req?: Request,
  ): Promise<ProductOrderEntity> {
    const { type, layers, deliveryDate, file } = updateOrderDto;
    const order = await this.getOrderWithId(id, user);
    // if (file) {
    const newImage = await this.cloudinaryService.uploadImage(req.file);

    if (order.imageUrl) {
      const oldPublicId = this.extractPublicId(order.imageUrl);
      console.log('old', oldPublicId);
      await this.cloudinaryService.deleteImage(oldPublicId);
    }
    order.imageUrl = newImage.secure_url;
    // }
    order.type = type;
    order.layers = layers;
    order.deliveryDate = deliveryDate;

    try {
      await order.save();
      this.logger.verbose(
        `User ${user.firstname} has successfully updated order with id ${id}`,
      );
    } catch (error) {
      this.logger.error(
        `User ${user.firstname} failed to update order with id  ${id}`,
      );
      console.log(error);
      throw new InternalServerErrorException();
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
}
