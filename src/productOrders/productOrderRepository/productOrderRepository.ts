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
  GenericProductOrderDto,
  UpdateOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import {
  DesignCovering,
  OrderStatus,
  ProductFlavours,
  ProductType,
} from '../ProductOrderEnum/productOrderEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { fetchDesignRate, fetchRate } from '../productUtility';

@Injectable()
export class ProductRepository extends Repository<ProductOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
  ) {
    super(ProductOrderEntity, dataSource.createEntityManager());
  }

  async createCustomProductOrder(
    customProductOrderDto: CustomProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<ProductOrderEntity | any> {
    console.log('hereeee');
    const {
      orderName,
      deliveryDate,
      description,
      productFlavour,
      designCovering,
      layers,
      inches,
    } = customProductOrderDto;

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new ProductOrderEntity();
    let rate = 0;
    let designrate = 0;

    const newRate = await fetchRate();
    const designRate = await fetchDesignRate();

    const flavorRateMap: { [key: string]: string } = {
      [ProductFlavours.appleCake]: 'appleCakeRate',
      [ProductFlavours.bananaCake]: 'bananaCakeRate',
      [ProductFlavours.blueberryCake]: 'blueberryCakeRate',
      [ProductFlavours.carrotCake]: 'carrotCakeRate',
      [ProductFlavours.cheeseCake]: 'cheeseCakeRate',
      [ProductFlavours.chocolateCake]: 'chocolateCakeRate',
      [ProductFlavours.coconutCake]: 'coconutCakeRate',
      [ProductFlavours.coffeeCake]: 'coffeeCakeRate',
      [ProductFlavours.lemonCake]: 'lemonCakeRate',
      [ProductFlavours.redvelvetCake]: 'redvelvetCakeRate',
      [ProductFlavours.strawberryCake]: 'strawberryCakeRate',
      [ProductFlavours.vanillaCake]: 'vanillaCakeRate',
    };
    // Set rate based on the selected product flavor
    if (flavorRateMap.hasOwnProperty(productFlavour)) {
      rate = Number(newRate[0][flavorRateMap[productFlavour]]);
    }

    const designRateMap: { [Key: string]: string } = {
      [DesignCovering.naked]: 'nakedRate',
      [DesignCovering.butterCream]: 'butterCreamRate',
      [DesignCovering.fundant]: 'fundantRate',
    };

    if (designRateMap.hasOwnProperty(designCovering)) {
      designrate = Number(designRate[0][designRateMap[designCovering]]);
    }

    order.id = uuid();
    order.orderName = orderName;
    order.type = ProductType.Birthday;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.productFlavour = productFlavour;
    order.designCovering = designCovering;
    order.layers = layers;
    order.inches = inches;
    order.designRate = designrate.toString();
    order.rate = rate.toString();
    const price = rate * Number(layers) * Number(inches) * designrate;
    order.price = price.toString();
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
      await this.mailerService.productOrderMail(user.email, order);
      this.logger.verbose(
        `user ${user} has successfully placed an order ${order.id}`,
      );
    } catch (error) {
      this.logger.error('error placing order');
      throw new InternalServerErrorException(
        'error creating order, please try again later',
      );
    }

    return {
      id: order.id,
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

  async genericProductOrder(
    genericProductOrderDto: GenericProductOrderDto,
    user: AuthEntity,
  ): Promise<ProductOrderEntity | any> {
    const {
      orderName,
      deliveryDate,
      imageUrl,
      description,
      productFlavour,
      designCovering,
      layers,
      inches,
    } = genericProductOrderDto;

    const order = new ProductOrderEntity();

    let rate = 0;
    let designrate = 0;

    const newRate = await fetchRate();
    const designRate = await fetchDesignRate();

    const flavorRateMap: { [key: string]: string } = {
      [ProductFlavours.appleCake]: 'appleCakeRate',
      [ProductFlavours.bananaCake]: 'bananaCakeRate',
      [ProductFlavours.blueberryCake]: 'blueberryCakeRate',
      [ProductFlavours.carrotCake]: 'carrotCakeRate',
      [ProductFlavours.cheeseCake]: 'cheeseCakeRate',
      [ProductFlavours.chocolateCake]: 'chocolateCakeRate',
      [ProductFlavours.coconutCake]: 'coconutCakeRate',
      [ProductFlavours.coffeeCake]: 'coffeeCakeRate',
      [ProductFlavours.lemonCake]: 'lemonCakeRate',
      [ProductFlavours.redvelvetCake]: 'redvelvetCakeRate',
      [ProductFlavours.strawberryCake]: 'strawberryCakeRate',
      [ProductFlavours.vanillaCake]: 'vanillaCakeRate',
    };
    // Set rate based on the selected product flavor
    if (flavorRateMap.hasOwnProperty(productFlavour)) {
      rate = Number(newRate[0][flavorRateMap[productFlavour]]);
    }

    const designRateMap: { [Key: string]: string } = {
      [DesignCovering.naked]: 'nakedRate',
      [DesignCovering.butterCream]: 'butterCreamRate',
      [DesignCovering.fundant]: 'fundantRate',
    };

    if (designRateMap.hasOwnProperty(designCovering)) {
      designrate = Number(designRate[0][designRateMap[designCovering]]);
    }

    order.id = uuid();
    order.orderName = orderName;
    order.type = ProductType.Birthday;
    order.productFlavour = productFlavour;
    order.designCovering = designCovering;
    order.designRate = designrate.toString();
    order.layers = layers;
    order.inches = inches;
    order.rate = rate.toString();
    order.deliveryDate = deliveryDate;
    order.imageUrl = imageUrl;
    const price = rate * Number(layers) * Number(inches) * designrate;
    order.price = price.toString();
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
      await this.mailerService.productOrderMail(user.email, order);
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
      inches: order.inches,
      layers: order.layers,
      productFlavour: order.productFlavour,
      designCovering: order.designCovering,
      imageUrl: order.imageUrl,
      orderDate: order.orderDate,
      price: order.price,
      description: order.description,
      userId: order.user.id,
      deliveryDate: order.deliveryDate,
      status: order.status,
    };
  }

  async getOrders(user: AuthEntity): Promise<ProductOrderEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });

    const orders = await query.getMany();
    try {
      this.logger.verbose(
        `user with id ${user.id} orders fetched successfully`,
      );
    } catch (error) {
      this.logger.error(`orders for user ${user.id} not found`);
      throw new NotFoundException(`orders for user ${user.id} not found`);
    }

    return orders;
  }

  async getOrderWithId(
    id: string,
    user: AuthEntity,
  ): Promise<ProductOrderEntity | any> {
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
      throw new InternalServerErrorException(
        `failed to get order with id ${id}`,
      );
    }
  }

  async updateOrder(
    id: string,
    user: AuthEntity,
    updateOrderDto?: UpdateOrderDto,
    req?: Request,
  ): Promise<ProductOrderEntity | any> {
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

    const order = await this.getOrderWithId(id, user);

    if (file) {
      const newImage = await this.cloudinaryService.uploadImage(req.file);

      if (order.imageUrl) {
        const oldPublicId = this.extractPublicId(order.imageUrl);
        console.log('old', oldPublicId);
        await this.cloudinaryService.deleteImage(oldPublicId);
      }
      order.imageUrl = newImage.secure_url;
    }

    let rate = 0;
    let designrate = 0;

    const newRate = await fetchRate();
    const designRate = await fetchDesignRate();

    const flavorRateMap: { [key: string]: string } = {
      [ProductFlavours.appleCake]: 'appleCakeRate',
      [ProductFlavours.bananaCake]: 'bananaCakeRate',
      [ProductFlavours.blueberryCake]: 'blueberryCakeRate',
      [ProductFlavours.carrotCake]: 'carrotCakeRate',
      [ProductFlavours.cheeseCake]: 'cheeseCakeRate',
      [ProductFlavours.chocolateCake]: 'chocolateCakeRate',
      [ProductFlavours.coconutCake]: 'coconutCakeRate',
      [ProductFlavours.coffeeCake]: 'coffeeCakeRate',
      [ProductFlavours.lemonCake]: 'lemonCakeRate',
      [ProductFlavours.redvelvetCake]: 'redvelvetCakeRate',
      [ProductFlavours.strawberryCake]: 'strawberryCakeRate',
      [ProductFlavours.vanillaCake]: 'vanillaCakeRate',
    };
    // Set rate based on the selected product flavor
    if (flavorRateMap.hasOwnProperty(productFlavour)) {
      rate = Number(newRate[0][flavorRateMap[productFlavour]]);
    }

    const designRateMap: { [Key: string]: string } = {
      [DesignCovering.naked]: 'nakedRate',
      [DesignCovering.butterCream]: 'butterCreamRate',
      [DesignCovering.fundant]: 'fundantRate',
    };

    if (designRateMap.hasOwnProperty(designCovering)) {
      designrate = Number(designRate[0][designRateMap[designCovering]]);
    }
    order.orderName = orderName;
    order.type = type;
    order.layers = Number(layers);
    order.inches = Number(inches);
    order.deliveryDate = deliveryDate;
    order.description = description;
    order.productFlavour = productFlavour;
    order.designCovering = designCovering;
    order.rate = rate.toString();
    order.designRate = designrate.toString();
    order.price = rate * order.layers * order.inches * designrate;

    try {
      await order.save();
      await this.mailerService.updateOrderMail(user.email, order);
      this.logger.verbose(
        `User ${user.firstname} has successfully updated order with id ${id}`,
      );
    } catch (error) {
      this.logger.error(
        `User ${user.firstname} failed to update order with id  ${id}`,
      );
      console.log(error);
      throw new InternalServerErrorException(
        `failed to update order with id ${id}`,
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
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ProductOrderEntity | string> {
    const { deliveryDate } = updateOrderDto;
    const order = await this.getOrderWithId(id, user);

    order.status = OrderStatus.cancel;
    order.deliveryDate = deliveryDate;

    try {
      if (order.status === OrderStatus.cancel) {
        return order;
      } else {
        await order.save();
        await this.mailerService.cancelOrderMail(user.email, order);
        this.logger.verbose(`order with id ${id} has been canceled`);
      }
    } catch (error) {
      throw new NotFoundException(`order with id ${id} not found`);
    }
    if (order.status === OrderStatus.cancel) {
      return `order with id ${id} has already been canceled`;
    }
    return `order with ${id} has been canceled`;
  }

  async orderDelivered(
    id: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ProductOrderEntity | string> {
    const { token } = updateOrderDto;

    const order = await this.getOrderWithId(id, user);

    order.token = token;
    order.status = OrderStatus.delivered;

    try {
      await order.save();
      await this.mailerService.orderDeliveryMail(user.email, order);
      this.logger.verbose(`order with ${id} has been delivered`);
    } catch (error) {
      this.logger.error(`token not valid`);
      throw new NotFoundException(`token ${token} not valid`);
    }
    if (order.status === OrderStatus.delivered) {
      return `order with id ${id} has already been delivered`;
    }
    return `order with ${id} has been delivered`;
  }

  async deleteOrder(id: string, user: AuthEntity): Promise<string> {
    const result = await this.delete({
      id,
      userId: user.id,
    });

    if (!result) {
      throw new NotFoundException(`${id} not found`);
    }

    try {
      this.logger.verbose(`order with id ${id} has been successfully deleted`);
      return `order with ${id}, successfully deleted`;
    } catch (error) {
      this.logger.error(
        `User ${user} encountered an error deleting order with ${id}`,
      );
      throw new InternalServerErrorException(
        `error deleting order with id ${id}`,
      );
    }
  }
}
