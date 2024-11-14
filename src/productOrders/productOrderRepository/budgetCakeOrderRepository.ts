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
  GenericChopsOrderDto,
  CartDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import {
  DesignCovering,
  OrderStatus,
  ProductFlavours,
  ProductType,
  ChopProductType,
} from '../ProductOrderEnum/productOrderEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { fetchDesignRate, fetchRate } from '../productUtility';
import { CloudinaryUrlDto } from '../../cloudinary/coundinaryDto/cloudinaryUrlDto';
import { BudgetCakeOrderEntity } from '../productOrderEntity/budgetCakeOrderEntity';
import { CartRepository } from './cartRepository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BudgetCakeOrderRepository extends Repository<BudgetCakeOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {
    super(BudgetCakeOrderEntity, dataSource.createEntityManager());
  }

  async budgetCakeOrder(
    genericProductOrderDto: GenericProductOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<BudgetCakeOrderEntity | any> {
    const {
      orderName,
      deliveryDate,
      description,
      productFlavour,
      designCovering,
      layers,
      inches,
      type,
    } = genericProductOrderDto;

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new BudgetCakeOrderEntity();

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
      // console.log(chopsRateMap[chopPackageType])
    }

    const designRateMap: { [Key: string]: string } = {
      [DesignCovering.butterCream]: 'butterCreamRate',
    };

    if (designRateMap.hasOwnProperty(designCovering)) {
      designrate = Number(designRate[0][designRateMap[designCovering]]);
    }

    order.budgetCakeId = uuid();
    order.orderName = orderName;
    order.type = type;
    order.productFlavour = productFlavour;
    order.designCovering = designCovering;
    order.designRate = designrate.toString();
    order.layers = layers;
    order.inches = inches;
    order.rate = rate.toString();
    order.deliveryDate = deliveryDate;
    order.imageUrl = cloudinaryUrl.secure_url;
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
    console.log(order);
    const email = user.email;

    const cartDto: CartDto = {
      itemName: '',
      price: '',
      imageUrl: '',
      productOrderId: '',
      itemType: '',
      deliveryDate: '',
    };

    cartDto['itemName'] = order.orderName;
    cartDto['price'] = order.price;
    cartDto['imageUrl'] = order.imageUrl;
    cartDto['productOrderId'] = order.budgetCakeId;
    cartDto['itemType'] = order.type;
    cartDto['deliveryDate'] = order.deliveryDate;
    try {
      await order.save();
      await this.mailerService.budgetCakeOrderMail(email, order);
      await this.cartRepository.addToCart(user, cartDto);
      this.logger.verbose(
        `user ${user} has successfully placed an order ${order.budgetCakeId}`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error('error placing order');
      throw new InternalServerErrorException(
        'error creating order, please try again later',
      );
    }

    return {
      id: order.budgetCakeId,
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

  async getOrders(user: AuthEntity): Promise<BudgetCakeOrderEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });
    console.log(user);
    const orders = await query.getMany();
    console.log(orders);
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
    budgetCakeId: string,
    user: AuthEntity,
  ): Promise<BudgetCakeOrderEntity | any> {
    const orderWithId = await this.findOne({
      where: {
        budgetCakeId,
        userId: user.id,
      },
    });

    if (!orderWithId) {
      throw new NotFoundException(`order with id ${budgetCakeId} not found`);
    }
    try {
      this.logger.verbose(
        `user ${user.firstname} successfully fetched order with id ${budgetCakeId}`,
      );
      return orderWithId;
    } catch (error) {
      this.logger.error(
        `User with ${user.firstname} failed to get order with id ${budgetCakeId}`,
      );
      throw new InternalServerErrorException(
        `failed to get order with id ${budgetCakeId}`,
      );
    }
  }

  async updateOrder(
    budgetCakeId: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
    req: Request,
    file: Express.Multer.File,
  ): Promise<BudgetCakeOrderEntity | any> {
    const {
      type,
      layers,
      deliveryDate,
      inches,
      description,
      orderName,
      productFlavour,
      designCovering,
    } = updateOrderDto;

    const order = await this.getOrderWithId(budgetCakeId, user);

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
    order.orderName = orderName || order.orderName;
    order.type = type || order.type;
    order.layers = Number(layers) || order.layers;
    order.inches = Number(inches) || order.inches;
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.description = description || order.description;
    order.productFlavour = productFlavour || order.productFlavour;
    order.designCovering = designCovering || order.designCovering;
    order.rate = rate.toString();
    order.designRate = designrate.toString();
    order.price = rate * order.layers * order.inches * designrate;

    try {
      await order.save();
      await this.mailerService.updateOrderMail(user.email, order);
      this.logger.verbose(
        `User ${user.firstname} has successfully updated order with id ${budgetCakeId}`,
      );
    } catch (error) {
      this.logger.error(
        `User ${user.firstname} failed to update order with id  ${budgetCakeId}`,
      );
      console.log(error);
      throw new InternalServerErrorException(
        `failed to update order with id ${budgetCakeId}`,
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
  ): Promise<BudgetCakeOrderEntity | string> {
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
    budgetCakeId: string,
    user: AuthEntity,
    updateOrderDto: UpdateOrderDto,
  ): Promise<BudgetCakeOrderEntity | string> {
    const { token } = updateOrderDto;

    const order = await this.getOrderWithId(budgetCakeId, user);

    order.token = token;
    order.status = OrderStatus.delivered;

    try {
      await order.save();
      await this.mailerService.orderDeliveryMail(user.email, order);
      this.logger.verbose(`order with ${budgetCakeId} has been delivered`);
    } catch (error) {
      this.logger.error(`token not valid`);
      throw new NotFoundException(`token ${token} not valid`);
    }
    if (order.status === OrderStatus.delivered) {
      return `order with id ${budgetCakeId} has already been delivered`;
    }
    return `order with ${budgetCakeId} has been delivered`;
  }

  async deleteOrder(budgetCakeId: string, user: AuthEntity): Promise<string> {
    const result = await this.delete({
      budgetCakeId,
      userId: user.id,
    });

    if (!result) {
      throw new NotFoundException(`${budgetCakeId} not found`);
    }

    try {
      this.logger.verbose(
        `order with id ${budgetCakeId} has been successfully deleted`,
      );
      return `order with ${budgetCakeId}, successfully deleted`;
    } catch (error) {
      this.logger.error(
        `User ${user} encountered an error deleting order with ${budgetCakeId}`,
      );
      throw new InternalServerErrorException(
        `error deleting order with id ${budgetCakeId}`,
      );
    }
  }
}
