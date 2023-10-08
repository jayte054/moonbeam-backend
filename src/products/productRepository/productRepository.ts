import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { DataSource, Repository } from 'typeorm';
import { ProductOrderDto } from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { ProductLayers, ProductType } from '../ProductEnum/productEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';

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
}
