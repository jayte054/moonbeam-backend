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
  GenericChopsOrderDto
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
  NumberOfPacks
} from '../ProductOrderEnum/productOrderEnum';
import { Request } from 'express';
import { CloudinaryService } from '../../cloudinary/cloudinaryService/cloudinaryService';
import { v4 as uuid } from 'uuid';
import { MailerService } from 'src/mailerModule/mailerService';
import { fetchDesignRate, fetchRate } from '../productUtility';
import {CloudinaryUrlDto} from '../../cloudinary/coundinaryDto/cloudinaryUrlDto'

type ChopsOrdeType = {
        id: string,
        orderTitle: string,
        type: ChopProductType,
        imageUrl: string,
        chopPackageType: ChopPackageType,
        customChopPackage: string,
        numberOfPacks: NumberOfPacks,
        customNumberOfPacks: string,
        pastryPackageType: PastryPackageType,
        customPastryPackage: string,
        covering: Covering,
        price: string,
        deliveryDate: string,
        userId: string,
        description: string,
        status: OrderStatus,
}

@Injectable()
export class ChopsOrderRepository extends Repository<ChopsOrderEntity> {
  private logger = new Logger('ProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
  ) {
    super(ChopsOrderEntity, dataSource.createEntityManager());
  }

async genericChopsOrder(
    genericChopsOrderDto: GenericChopsOrderDto,
    user: AuthEntity,
    req: Request
  ): Promise<ChopsOrdeType> {
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

      const cloudinaryUrl: any = await this.cloudinaryService.uploadImage(
      req.file,
    );

    const order = new ChopsOrderEntity()

    let rate = 0;
    let coveringrate = 0;

    const newRate = await fetchRate(); //modify to suit chop orders
    const coveringRate = await fetchDesignRate(); ////modify to suit chop orders

    const chopsRateMap : { [key: string]: string} = {
      [ChopPackageType.samosa]: "samosaRate",
      [ChopPackageType.springroll]: "springrollRate",
      [ChopPackageType.mixed_SS]: "samosa_springrollRate",
      [ChopPackageType.puff]: "puffRate",
      [ChopPackageType.pepperedMeat]: "pepperedMeatRate",
      [ChopPackageType.mixed_PP]: "puff_pepperedMeatRate",
      [ChopPackageType.mixed_SaP]: "samosa_pepperedMeatRate",
      [ChopPackageType.mixed_SpP]: "springroll_pepperedMeatRate"
    };

    if (chopsRateMap.hasOwnProperty(chopPackageType)) {
      rate = Number(newRate[0][chopsRateMap[chopPackageType]])
    }

    const pastryRateMap: {[key: string]: string} = {
      [PastryPackageType.meatPie]: "meatPieRate",
      [PastryPackageType.donuts]: "donutsRate",
      [PastryPackageType.cinamonRolls]: "cinamonRollsRate",
      [PastryPackageType.pancakes]: "pancakesRate",
      [PastryPackageType.corndogs]: "corndogsRate",
      [PastryPackageType.waffels]: "waffelsRate",
      [PastryPackageType.mixed_MD]: "meatpie_donutsRate",
      [PastryPackageType.mixed_PCW]: "pancakes_corndogs_waffelsRate"
    }

    if (pastryRateMap.hasOwnProperty(pastryPackageType)) {
      rate = Number(newRate[0][pastryRateMap[pastryPackageType]])
    }

    const coveringRateMap: {[key: string]: string} = {
      [Covering.true]: "true",
      [Covering.false]: "false"
    }

    if (coveringRateMap.hasOwnProperty(covering)) {
      coveringrate = Number(coveringRate[0][coveringRateMap[covering]])
    }

    order.id = uuid();
    order.orderTitle = orderTitle;
    order.type = type;
    order.imageUrl = cloudinaryUrl.secure_url;
    order.chopPackageType= chopPackageType;
    order.customChopPackage = customChopPackage;
    order.numberOfPacks = numberOfPacks
    order.customNumberOfPacks = customNumberOfPacks;
    order.pastryPackageType = pastryPackageType;
    order.customPastryPackage = customPastryPackage;
    order.covering = covering;
    const price = rate * Number(numberOfPacks) * coveringrate || rate * Number(customNumberOfPacks) * coveringrate;
    order.price = price.toString()
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
    console.log(order)
    const email = user.email

    try{
      await order.save();
      await this.mailerService.chopsOrderMail(email, order);
      this.logger.verbose(
        `user ${user} has successfully placed an order ${order.id}`,
      );
    } catch(error) {
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
      }
  }
}