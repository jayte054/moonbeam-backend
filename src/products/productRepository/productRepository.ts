import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import {
  CustomProductOrderDto,
  GenericProductOrderDto,
  UpdateOrderDto,
} from '../productDto/productOrderDto';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import {
  OrderStatus,
  ProductFlavours,
  ProductInch,
  ProductLayers,
  ProductType,
} from '../ProductEnum/productEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { fetchRate } from '../productUtility';

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
    const { orderName, deliveryDate, description, productFlavour } =
      customProductOrderDto;

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new ProductOrderEntity();
    let rate = 0;
    console.log('rate_0,', rate);

    const newRate = await fetchRate();
    console.log(newRate[0].appleCakeRate);

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

    const layers = Number(ProductLayers.one);
    const inches = Number(ProductInch.six);

    order.id = uuid();
    order.orderName = orderName;
    order.type = ProductType.Birthday;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.productFlavour = productFlavour;
    order.layers = ProductLayers.one;
    order.inches = ProductInch.six;
    // if (order.productFlavour === ProductFlavours.appleCake) {
    //   console.log('Updating rate');
    //   rate = Number(newRate[0].appleCakeRate);
    // } else if (order.productFlavour === ProductFlavours.bananaCake) {
    //   rate = Number(newRate[0].bananaCakeRate);
    // } else if (order.productFlavour === ProductFlavours.blueberryCake) {
    //   rate = Number(newRate[0].blueberryCakeRate);
    // } else if (order.productFlavour === ProductFlavours.carrotCake) {
    //   rate = Number(newRate[0].carrotCakeRate);
    // } else if (order.productFlavour === ProductFlavours.cheeseCake) {
    //   rate = Number(newRate[0].cheeseCakeRate);
    // } else if (order.productFlavour === ProductFlavours.chocolateCake) {
    //   rate = Number(newRate[0].chocolateCakeRate);
    // } else if (order.productFlavour === ProductFlavours.coconutCake) {
    //   rate = Number(newRate[0].coconutCakeRate);
    // } else if (order.productFlavour === ProductFlavours.coffeeCake) {
    //   rate = Number(newRate[0].coffeeCakeRate);
    // } else if (order.productFlavour === ProductFlavours.lemonCake) {
    //   rate = Number(newRate[0].lemonCakeRate);
    // } else if (order.productFlavour === ProductFlavours.redvelvetCake) {
    //   rate = Number(newRate[0].redvelvetCakeRate);
    // } else if (order.productFlavour === ProductFlavours.strawberryCake) {
    //   rate = Number(newRate[0].strawberryCakeRate);
    // } else if (order.productFlavour === ProductFlavours.vanillaCake) {
    //   rate = Number(newRate[0].vanillaCakeRate);
    // }
    // console.log('Final rate value:', rate);

    order.rate = rate.toString();
    const price = rate * layers * inches;
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
      console.log('nod done');
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
    const { orderName, deliveryDate, imageUrl, description } =
      genericProductOrderDto;

    const layers = Number(ProductLayers.one);
    const inches = Number(ProductInch.six);
    const rate = '5000'; //modify later
    const price = Number(rate) * layers * inches;

    const order = new ProductOrderEntity();
    order.id = uuid();
    order.orderName = orderName;
    order.type = ProductType.Birthday;
    order.layers = ProductLayers.one;
    order.inches = ProductInch.six;
    order.rate = rate;
    order.deliveryDate = deliveryDate;
    order.imageUrl = imageUrl;
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
    }

    return orders;
    // const options: FindOneOptions<ProductOrderEntity> = {};

    // const orders: any = await this.find(options);
    // if (!orders) {
    //   this.logger.error('orders not found');
    //   throw new NotFoundException('orders not found');
    // }
    // this.logger.verbose('orders fetched successfully');
    // return orders;
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
      throw new InternalServerErrorException();
    }
  }

  async updateOrder(
    id: string,
    user: AuthEntity,
    updateOrderDto?: UpdateOrderDto,
    req?: Request,
  ): Promise<ProductOrderEntity | any> {
    const { type, layers, deliveryDate, inches, description, orderName, file } =
      updateOrderDto;

    const rate = '5000'; //modify later

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
    order.orderName = orderName;
    order.type = type;
    order.layers = Number(layers);
    order.inches = Number(inches);
    order.deliveryDate = deliveryDate;
    order.description = description;
    order.price = Number(rate) * order.layers * order.inches;

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
      throw new NotFoundException();
    }

    try {
      this.logger.verbose(`order with id ${id} has been successfully deleted`);
      return `order with ${id}, successfully deleted`;
    } catch (error) {
      this.logger.error(
        `User ${user} encountered an error deleting order with ${id}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
