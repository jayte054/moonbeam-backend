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
  GenericChopsOrderDto,
  UpdateGenericChopsOrderDto,
  CartDto,
} from '../productOrderDto/productOrderDto';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import {
  DesignCovering,
  OrderStatus,
  ChopPackageType,
  ProductType,
  ChopProductType,
  PastryPackageType,
  Covering,
  NumberOfPacks,
  CategoryType,
} from '../ProductOrderEnum/productOrderEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { fetchDesignRate, fetchRate } from '../productUtility';
import { CloudinaryUrlDto } from '../../cloudinary/coundinaryDto/cloudinaryUrlDto';
import { UpdateSurprisePackageDto } from 'src/adminHubModule/adminHubDto/adminHubDto';
import { CartRepository } from './cartRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { ChopsOrderType } from 'src/types';

@Injectable()
export class ChopsOrderRepository extends Repository<ChopsOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {
    super(ChopsOrderEntity, dataSource.createEntityManager());
  }

  async genericChopsOrder(
    genericChopsOrderDto: GenericChopsOrderDto,
    user: AuthEntity,
    req: Request,
  ): Promise<ChopsOrderType> {
    const {
      orderTitle,
      deliveryDate,
      description,
      type,
      chopPackageType,
      customChopPackage,
      numberOfPacks,
      customNumberOfPacks,
      pastryPackageType,
      customPastryPackage,
      covering,
    } = genericChopsOrderDto;
    console.log(genericChopsOrderDto);

    const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new ChopsOrderEntity();

    let rate = 0;
    let coveringrate = 0;

    const newRate = await fetchRate(); //modify to suit chop orders
    const coveringRate = await fetchDesignRate(); ////modify to suit chop orders

    const chopsRateMap: { [key: string]: string } = {
      [ChopPackageType.samosa]: 'samosaRate',
      [ChopPackageType.springroll]: 'springRollRate',
      [ChopPackageType.samosa_spingroll]: 'samosa_springrollRate',
      [ChopPackageType.puff]: 'puffRate',
      [ChopPackageType.pepperedMeat]: 'pepperedMeatRate',
      [ChopPackageType.puff_pepperedMeat]: 'puff_pepperedMeatRate',
      [ChopPackageType.samosa_pepperedMeat]: 'samosa_pepperedMeatRate',
      [ChopPackageType.springroll_pepperedMeat]: 'springroll_pepperedMeatRate',
    };

    if (chopsRateMap.hasOwnProperty(chopPackageType)) {
      rate = Number(newRate[0][chopsRateMap[chopPackageType]]);
    } else {
      this.logger.error('Invalid Chop Package Type:', chopPackageType);
    }

    const pastryRateMap: { [key: string]: string } = {
      [PastryPackageType.meatPie]: 'meatPieRate',
      [PastryPackageType.donuts]: 'donutsRate',
      [PastryPackageType.cinamonRolls]: 'cinamonRollsRate',
      [PastryPackageType.pancakes]: 'pancakesRate',
      [PastryPackageType.corndogs]: 'corndogsRate',
      [PastryPackageType.waffels]: 'waffelsRate',
      [PastryPackageType.meatPie_donuts]: 'meatpie_donutsRate',
      [PastryPackageType.pancakes_corndogs_waffels]:
        'pancakes_corndogs_waffelsRate',
    };

    if (pastryRateMap.hasOwnProperty(pastryPackageType)) {
      rate = Number(newRate[0][pastryRateMap[pastryPackageType]]);
    } else {
      this.logger.error('Invalid Chop Package Type:', pastryPackageType);
    }

    if (covering === 'true') {
      coveringrate = Number(coveringRate[0].coveringRate);
    } else if (covering === 'false') {
      coveringrate = 1;
    }

    order.id = uuid();
    order.orderTitle = orderTitle;
    order.type = type;
    order.category =
      order.type === 'chops' ? CategoryType.chops : CategoryType.pastry;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.chopPackageType = chopPackageType;
    order.customChopPackage = customChopPackage;
    order.numberOfPacks = numberOfPacks;
    order.customNumberOfPacks = customNumberOfPacks;
    order.pastryPackageType = pastryPackageType;
    order.customPastryPackage = customPastryPackage;
    order.covering = covering;
    order.rate = rate.toString();
    const price =
      (order.covering
        ? rate * Number(numberOfPacks) * coveringrate
        : rate * Number(numberOfPacks)) |
      (order.covering
        ? rate * Number(customNumberOfPacks) * coveringrate
        : rate * Number(customNumberOfPacks));
    order.price = price.toString();
    order.description = description;
    order.status = OrderStatus.progress;
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
      productOrderId: '',
      itemName: '',
      price: '',
      imageUrl: '',
      itemType: '',
      category: '',
      quantity: '',
      deliveryDate: '',
    };

    cartDto['itemName'] = order.orderTitle;
    cartDto['price'] = order.price;
    cartDto['imageUrl'] = order.imageUrl;
    cartDto['itemType'] = order.type;
    cartDto['quantity'] = order.numberOfPacks;
    cartDto['deliveryDate'] = order.deliveryDate;
    cartDto['productOrderId'] = order.id;
    cartDto['category'] = order.category;

    try {
      await order.save();
      await this.mailerService.chopsOrderMail(email, order);
      await this.cartRepository.addToCart(user, cartDto);
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
      orderTitle: order.orderTitle,
      type: order.type,
      category: order.category,
      imageUrl: order.imageUrl,
      chopPackageType: order.chopPackageType,
      customChopPackage: order.customChopPackage,
      numberOfPacks: order.numberOfPacks,
      customNumberOfPacks: order.customNumberOfPacks,
      pastryPackageType: order.pastryPackageType,
      customPastryPackage: order.customPastryPackage,
      covering: order.covering,
      price: order.price,
      deliveryDate: order.deliveryDate,
      userId: order.user.id,
      description: order.description,
      status: order.status,
    };
  }

  async getChopsOrders(user: AuthEntity): Promise<ChopsOrderEntity[]> {
    const options: FindOneOptions<ChopsOrderEntity> = {};
    console.log('chops');
    const chopsOrders = this.find(options);

    if (!chopsOrders) {
      this.logger.error('Chops Orders not found');
      throw new NotFoundException('Chops Orders not found');
    }

    this.logger.verbose(
      `packages ordered by user ${user.email} fetched successfully`,
    );
    return chopsOrders;
  }

  async getChopOrderWithId(
    id: string,
    user: AuthEntity,
  ): Promise<ChopsOrderEntity> {
    const chopOrder = this.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!chopOrder) {
      this.logger.error(`chop order with id ${id} not found`);
      throw new NotFoundException(`chop order with id ${id} not found`);
    }
    this.logger.verbose(`chop order with id ${id} fetched successfully`);
    return chopOrder;
  }

  async updateChopOrders(
    id: string,
    user: AuthEntity,
    updateGenericChopsOrderDto: UpdateGenericChopsOrderDto,
  ): Promise<ChopsOrderEntity> {
    const {
      orderTitle,
      deliveryDate,
      description,
      type,
      chopPackageType,
      customChopPackage,
      numberOfPacks,
      customNumberOfPacks,
      pastryPackageType,
      customPastryPackage,
      category,
      covering,
    } = updateGenericChopsOrderDto;

    const saidChopOrder = await this.getChopOrderWithId(id, user);

    let rate = 0;
    let coveringrate = 0;

    const newRate = await fetchRate(); //modify to suit chop orders
    const coveringRate = await fetchDesignRate(); ////modify to suit chop orders

    const chopsRateMap: { [key: string]: string } = {
      [ChopPackageType.samosa]: 'samosaRate',
      [ChopPackageType.springroll]: 'springRollRate',
      [ChopPackageType.samosa_spingroll]: 'samosa_springrollRate',
      [ChopPackageType.puff]: 'puffRate',
      [ChopPackageType.pepperedMeat]: 'pepperedMeatRate',
      [ChopPackageType.puff_pepperedMeat]: 'puff_pepperedMeatRate',
      [ChopPackageType.samosa_pepperedMeat]: 'samosa_pepperedMeatRate',
      [ChopPackageType.springroll_pepperedMeat]: 'springroll_pepperedMeatRate',
    };

    if (chopsRateMap.hasOwnProperty(chopPackageType)) {
      rate = Number(newRate[0][chopsRateMap[chopPackageType]]);
    } else {
      this.logger.error('Invalid Chop Package Type:', chopPackageType);
    }

    const pastryRateMap: { [key: string]: string } = {
      [PastryPackageType.meatPie]: 'meatPieRate',
      [PastryPackageType.donuts]: 'donutsRate',
      [PastryPackageType.cinamonRolls]: 'cinamonRollsRate',
      [PastryPackageType.pancakes]: 'pancakesRate',
      [PastryPackageType.corndogs]: 'corndogsRate',
      [PastryPackageType.waffels]: 'waffelsRate',
      [PastryPackageType.meatPie_donuts]: 'meatpie_donutsRate',
      [PastryPackageType.pancakes_corndogs_waffels]:
        'pancakes_corndogs_waffelsRate',
    };

    if (pastryRateMap.hasOwnProperty(pastryPackageType)) {
      rate = Number(newRate[0][pastryRateMap[pastryPackageType]]);
    } else {
      this.logger.error('Invalid Pastry Package Type:', pastryPackageType);
    }

    if (covering === 'true') {
      coveringrate = Number(coveringRate[0].coveringRate);
    } else if (covering === 'false') {
      coveringrate = 1;
    }

    saidChopOrder.orderTitle = orderTitle || saidChopOrder.orderTitle;
    saidChopOrder.deliveryDate = deliveryDate || saidChopOrder.deliveryDate;
    saidChopOrder.description = description || saidChopOrder.description;
    saidChopOrder.numberOfPacks = numberOfPacks || saidChopOrder.numberOfPacks;
    saidChopOrder.covering = covering || saidChopOrder.covering;
    saidChopOrder.type = type || saidChopOrder.type;
    saidChopOrder.category = category || saidChopOrder.category;
    saidChopOrder.chopPackageType =
      chopPackageType || saidChopOrder.chopPackageType;
    saidChopOrder.pastryPackageType =
      pastryPackageType || saidChopOrder.pastryPackageType;
    saidChopOrder.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    saidChopOrder.status = OrderStatus.progress;
    saidChopOrder.rate = rate.toString();
    const price =
      (saidChopOrder.covering
        ? rate * Number(numberOfPacks) * coveringrate
        : rate * Number(numberOfPacks)) |
      (saidChopOrder.covering
        ? rate * Number(customNumberOfPacks) * coveringrate
        : rate * Number(customNumberOfPacks));
    saidChopOrder.price = price.toString();

    try {
      saidChopOrder.save();
      this.logger.verbose(
        `chop order with id ${id} has been updated successfully`,
      );
      this.mailerService.updateChopsOrderMail(user.email, saidChopOrder);
    } catch (error) {
      this.logger.error(`chop order with id ${id} failed to update`);
      throw new InternalServerErrorException(
        `failed to update order with id ${id}`,
      );
    }
    return saidChopOrder;
  }
}
