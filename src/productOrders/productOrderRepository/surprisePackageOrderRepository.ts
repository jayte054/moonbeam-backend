import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { MailerService } from 'src/mailerModule/mailerService';
import {
  CartDto,
  SurprisePackageOrderDto,
  UpdateSurprisePackageOrderDto,
} from '../productOrderDto/productOrderDto';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { OrderStatus } from '../ProductOrderEnum/productOrderEnum';
import { fetchPackages } from '../productUtility';
import {
  bronzePackageOrderType,
  diamondPackageOrderType,
  goldPackageOrderType,
  silverPackageOrderType,
} from 'src/types';
import { InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from './cartRepository';

@Injectable()
export class SurprisePackageOrderRepository extends Repository<SurprisePackageOrderEntity> {
  private logger = new Logger('SurprisePackageOrderRepository');
  constructor(
    private dataSource: DataSource,
    private mailerService: MailerService,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {
    super(SurprisePackageOrderEntity, dataSource.createEntityManager());
  }

  async bronzePackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<bronzePackageOrderType> {
    const { packageOrderName, deliveryDate, addInfo } = surprisePackageOrderDto;

    const setBronzePackage = await fetchPackages();
    console.log(setBronzePackage.bronzePackage);
    const bronzePackageData = setBronzePackage.bronzePackage;

    if (!bronzePackageData) {
      throw new NotFoundException('Bronze package not found');
    }

    const packageOrder = new SurprisePackageOrderEntity();

    packageOrder.packageOrderName = packageOrderName;
    packageOrder.packageName = bronzePackageData.packageName;
    packageOrder.bronzePackage = {
      itemOne: bronzePackageData.itemOne,
      itemTwo: bronzePackageData.itemTwo,
      itemThree: bronzePackageData.itemThree,
      itemFour: bronzePackageData.itemFour,
      itemFive: bronzePackageData.itemFive,
      itemSix: bronzePackageData.itemSix,
      description: bronzePackageData.description,
    };
    packageOrder.deliveryDate = deliveryDate;
    packageOrder.price = bronzePackageData.price;
    packageOrder.imageUrl = bronzePackageData.imageUrl;
    packageOrder.addInfo = addInfo;
    packageOrder.status = OrderStatus.progress;
    packageOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    packageOrder.user = user;

    const cartDto: CartDto = {
      itemName: '',
      price: '',
      imageUrl: '',
      productOrderId: '',
      itemType: '',
    };

    try {
      await packageOrder.save();

      cartDto['itemName'] = packageOrder.packageOrderName;
      cartDto['price'] = packageOrder.price;
      cartDto['imageUrl'] = packageOrder.imageUrl;
      cartDto['productOrderId'] = packageOrder.packageId;
      cartDto['itemType'] = "bronzePackage";

      await this.mailerService.bronzePackageOrderMail(user.email, packageOrder);
      await this.cartRepository.addToCart(user, cartDto);
      this.logger.verbose(`
        user with id ${user.id} has successfully placed with order ${packageOrder.packageOrderName}
        `);
    } catch (error) {
      this.logger.error(
        `failed to complete packageOrder with name ${packageOrderName}`,
      );
      throw new InternalServerErrorException('failed to complete packageOrder');
    }

    return {
      packageId: packageOrder.packageId,
      packageName: packageOrder.packageName,
      packageOrderName: packageOrder.packageOrderName,
      bronzePackage: {
        itemOne: packageOrder.bronzePackage.itemOne,
        itemTwo: packageOrder.bronzePackage.itemTwo,
        itemThree: packageOrder.bronzePackage.itemThree,
        itemFour: packageOrder.bronzePackage.itemFour,
        itemFive: packageOrder.bronzePackage.itemFive,
        itemSix: packageOrder.bronzePackage.itemSix,
        description: packageOrder.bronzePackage.description,
      },
      imageUrl: packageOrder.imageUrl,
      price: packageOrder.price,
      addInfo: packageOrder.addInfo,
      orderDate: packageOrder.orderDate,
      deliveryDate: packageOrder.deliveryDate,
      status: packageOrder.status,
      userId: user.id,
    };
  }

  async silverPackageOrder(
    surprisePackageDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<silverPackageOrderType> {
    const { packageOrderName, addInfo, deliveryDate } = surprisePackageDto;

    const setSilverPackage = await fetchPackages();
    console.log(setSilverPackage.silverPackage);
    const silverPackageData = setSilverPackage.silverPackage;

    if (!silverPackageData) {
      throw new NotFoundException('Silver package not found');
    }

    const packageOrder = new SurprisePackageOrderEntity();

    packageOrder.packageOrderName = packageOrderName;
    packageOrder.packageName = silverPackageData.packageName;
    packageOrder.silverPackage = {
      itemOne: silverPackageData.itemOne,
      itemTwo: silverPackageData.itemTwo,
      itemThree: silverPackageData.itemThree,
      itemFour: silverPackageData.itemFour,
      itemFive: silverPackageData.itemFive,
      itemSix: silverPackageData.itemSix,
      itemSeven: silverPackageData.itemSeven,
      itemEight: silverPackageData.itemEight,
      description: silverPackageData.description,
    };
    packageOrder.deliveryDate = deliveryDate;
    packageOrder.price = silverPackageData.price;
    packageOrder.imageUrl = silverPackageData.imageUrl;
    packageOrder.addInfo = addInfo;
    packageOrder.status = OrderStatus.progress;
    packageOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    packageOrder.user = user;

     const cartDto: CartDto = {
       itemName: '',
       price: '',
       imageUrl: '',
       productOrderId: '',
       itemType: '',
     };

    try {
      await packageOrder.save();
       cartDto['itemName'] = packageOrder.packageOrderName;
       cartDto['price'] = packageOrder.price;
       cartDto['imageUrl'] = packageOrder.imageUrl;
       cartDto['productOrderId'] = packageOrder.packageId;
       cartDto['itemType'] = 'silverPackage';
      await this.mailerService.silverPackageOrderMail(user.email, packageOrder);
      await this.cartRepository.addToCart(user, cartDto);
      this.logger.verbose(`
        user with id ${user.id} has successfully placed with order ${packageOrder.packageOrderName}
        `);
    } catch (error) {
      this.logger.error(
        `failed to complete packageOrder with name ${packageOrderName}`,
      );
      throw new InternalServerErrorException('failed to complete packageOrder');
    }
    return {
      packageId: packageOrder.packageId,
      packageName: packageOrder.packageName,
      packageOrderName: packageOrder.packageOrderName,
      silverPackage: {
        itemOne: packageOrder.silverPackage.itemOne,
        itemTwo: packageOrder.silverPackage.itemTwo,
        itemThree: packageOrder.silverPackage.itemThree,
        itemFour: packageOrder.silverPackage.itemFour,
        itemFive: packageOrder.silverPackage.itemFive,
        itemSix: packageOrder.silverPackage.itemSix,
        itemSeven: packageOrder.silverPackage.itemSeven,
        itemEight: packageOrder.silverPackage.itemEight,
        description: packageOrder.silverPackage.description,
      },
      imageUrl: packageOrder.imageUrl,
      price: packageOrder.price,
      addInfo: packageOrder.addInfo,
      orderDate: packageOrder.orderDate,
      deliveryDate: packageOrder.deliveryDate,
      status: packageOrder.status,
      userId: user.id,
    };
  }

  async goldPackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<goldPackageOrderType> {
    const { packageOrderName, addInfo, deliveryDate } = surprisePackageOrderDto;

    const setGoldPackage = await fetchPackages();
    const goldPackageData = setGoldPackage.goldPackage;

    if (!goldPackageData) {
      throw new NotFoundException('Gold package not found');
    }

    const packageOrder = new SurprisePackageOrderEntity();

    packageOrder.packageOrderName = packageOrderName;
    packageOrder.packageName = goldPackageData.packageName;
    packageOrder.goldPackage = {
      itemOne: goldPackageData.itemOne,
      itemTwo: goldPackageData.itemTwo,
      itemThree: goldPackageData.itemThree,
      itemFour: goldPackageData.itemFour,
      itemFive: goldPackageData.itemFive,
      itemSix: goldPackageData.itemSix,
      itemSeven: goldPackageData.itemSeven,
      itemEight: goldPackageData.itemEight,
      itemNine: goldPackageData.itemNine,
      itemTen: goldPackageData.itemTen,
      description: goldPackageData.description,
    };
    packageOrder.deliveryDate = deliveryDate;
    packageOrder.price = goldPackageData.price;
    packageOrder.imageUrl = goldPackageData.imageUrl;
    packageOrder.addInfo = addInfo;
    packageOrder.status = OrderStatus.progress;
    packageOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    packageOrder.user = user;

     const cartDto: CartDto = {
       itemName: '',
       price: '',
       imageUrl: '',
       productOrderId: '',
       itemType: '',
     };

    try {
      await packageOrder.save();
      cartDto['itemName'] = packageOrder.packageOrderName;
      cartDto['price'] = packageOrder.price;
      cartDto['imageUrl'] = packageOrder.imageUrl;
      cartDto['productOrderId'] = packageOrder.packageId;
      cartDto['itemType'] = 'goldPackage';
      await this.mailerService.goldPackageOrderMail(user.email, packageOrder);
      await this.cartRepository.addToCart(user, cartDto);
      this.logger.verbose(`
        user with id ${user.id} has successfully placed with order ${packageOrder.packageOrderName}
        `);
    } catch (error) {
      this.logger.error(
        `failed to complete packageOrder with name ${packageOrderName}`,
      );
      throw new InternalServerErrorException('failed to complete packageOrder');
    }

    return {
      packageId: packageOrder.packageId,
      packageName: packageOrder.packageName,
      packageOrderName: packageOrder.packageOrderName,
      goldPackage: {
        itemOne: packageOrder.goldPackage.itemOne,
        itemTwo: packageOrder.goldPackage.itemTwo,
        itemThree: packageOrder.goldPackage.itemThree,
        itemFour: packageOrder.goldPackage.itemFour,
        itemFive: packageOrder.goldPackage.itemFive,
        itemSix: packageOrder.goldPackage.itemSix,
        itemSeven: packageOrder.goldPackage.itemSeven,
        itemEight: packageOrder.goldPackage.itemEight,
        itemNine: packageOrder.goldPackage.itemNine,
        itemTen: packageOrder.goldPackage.itemTen,
        description: packageOrder.goldPackage.description,
      },
      imageUrl: packageOrder.imageUrl,
      price: packageOrder.price,
      addInfo: packageOrder.addInfo,
      orderDate: packageOrder.orderDate,
      deliveryDate: packageOrder.deliveryDate,
      status: packageOrder.status,
      userId: user.id,
    };
  }

  async diamondPackageOrder(
    surprisePackageDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<diamondPackageOrderType> {
    const { packageOrderName, addInfo, deliveryDate } = surprisePackageDto;

    const setDiamondPackage = await fetchPackages();
    const diamondPackageData = setDiamondPackage.diamondPackage;

    if (!diamondPackageData) {
      throw new NotFoundException('diamond package not found');
    }

    const packageOrder = new SurprisePackageOrderEntity();

    packageOrder.packageOrderName = packageOrderName;
    packageOrder.packageName = diamondPackageData.packageName;
    packageOrder.diamondPackage = {
      itemOne: diamondPackageData.itemOne,
      itemTwo: diamondPackageData.itemTwo,
      itemThree: diamondPackageData.itemThree,
      itemFour: diamondPackageData.itemFour,
      itemFive: diamondPackageData.itemFive,
      itemSix: diamondPackageData.itemSix,
      itemSeven: diamondPackageData.itemSeven,
      itemEight: diamondPackageData.itemEight,
      itemNine: diamondPackageData.itemNine,
      itemTen: diamondPackageData.itemTen,
      itemEleven: diamondPackageData.itemEleven,
      itemTwelve: diamondPackageData.itemTwelve,
      description: diamondPackageData.description,
    };
    packageOrder.deliveryDate = deliveryDate;
    packageOrder.price = diamondPackageData.price;
    packageOrder.imageUrl = diamondPackageData.imageUrl;
    packageOrder.addInfo = addInfo;
    packageOrder.status = OrderStatus.progress;
    packageOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    packageOrder.user = user;

     const cartDto: CartDto = {
       itemName: '',
       price: '',
       imageUrl: '',
       productOrderId: '',
       itemType: '',
     };

    try {
      await packageOrder.save();
      cartDto['itemName'] = packageOrder.packageOrderName;
      cartDto['price'] = packageOrder.price;
      cartDto['imageUrl'] = packageOrder.imageUrl;
      cartDto['productOrderId'] = packageOrder.packageId;
      cartDto['itemType'] = 'silverPackage';
      await this.mailerService.diamondPackageOrderMail(
        user.email,
        packageOrder,
      );
      await this.cartRepository.addToCart(user, cartDto);
      this.logger.verbose(`
        user with id ${user.id} has successfully placed with order ${packageOrder.packageOrderName}
        `);
    } catch (error) {
      this.logger.error(
        `failed to complete packageOrder with name ${packageOrderName}`,
      );
      throw new InternalServerErrorException('failed to complete packageOrder');
    }
    return {
      packageId: packageOrder.packageId,
      packageName: packageOrder.packageName,
      packageOrderName: packageOrder.packageOrderName,
      diamondPackage: {
        itemOne: packageOrder.diamondPackage.itemOne,
        itemTwo: packageOrder.diamondPackage.itemTwo,
        itemThree: packageOrder.diamondPackage.itemThree,
        itemFour: packageOrder.diamondPackage.itemFour,
        itemFive: packageOrder.diamondPackage.itemFive,
        itemSix: packageOrder.diamondPackage.itemSix,
        itemSeven: packageOrder.diamondPackage.itemSeven,
        itemEight: packageOrder.diamondPackage.itemEight,
        itemNine: packageOrder.diamondPackage.itemNine,
        itemTen: packageOrder.diamondPackage.itemTen,
        itemEleven: packageOrder.diamondPackage.itemEleven,
        itemTwelve: packageOrder.diamondPackage.itemTwelve,
        description: packageOrder.diamondPackage.description,
      },
      imageUrl: packageOrder.imageUrl,
      price: packageOrder.price,
      addInfo: packageOrder.addInfo,
      orderDate: packageOrder.orderDate,
      deliveryDate: packageOrder.deliveryDate,
      status: packageOrder.status,
      userId: user.id,
    };
  }

  async getSurprisePackageOrders(
    user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity[]> {
    const options: FindOneOptions<SurprisePackageOrderEntity> = {};

    const packages = await this.find(options);

    if (!packages) {
      this.logger.error('packages not found');
      throw new NotFoundException('packages not found');
    }
    this.logger.verbose(
      `packages ordered by user ${user.email} fetched successfully`,
    );
    return packages;
  }

  async getSurprisePackageOrdersWithId(
    packageId: string,
    user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity> {
    const packageOrder = await this.findOne({
      where: {
        packageId,
        userId: user.id,
      },
    });

    if (!packageOrder) {
      this.logger.error(`package order with id ${packageId} not found`);
      throw new NotFoundException(
        `package order with id ${packageId} not found`,
      );
    }
    this.logger.verbose(`
            package order with id ${packageId} fetched successfully  
        `);
    return packageOrder;
  }

  async updateSurprisePackageOrder(
    packageId: string,
    user: AuthEntity,
    updateSurprisePackageOrderDto: UpdateSurprisePackageOrderDto,
  ): Promise<SurprisePackageOrderEntity> {
    const { packageOrderName, addInfo, deliveryDate } =
      updateSurprisePackageOrderDto;

    const saidPackage = await this.getSurprisePackageOrdersWithId(
      packageId,
      user,
    );

    if (!saidPackage) {
      this.logger.error(`package with id ${packageId} not found`);
    }
    saidPackage.packageOrderName =
      packageOrderName || saidPackage.packageOrderName;
    saidPackage.addInfo = addInfo || saidPackage.addInfo;
    saidPackage.deliveryDate = deliveryDate || saidPackage.deliveryDate;

    try {
      await saidPackage.save();
      await this.mailerService.updatePackageOrderMail(user.email, saidPackage);
      this.logger.verbose(`package with id ${packageId} updated successfully`);
    } catch (error) {
      this.logger.error(`package with id ${packageId} failed to update`);
      throw new InternalServerErrorException(
        `failed to updatae package with id ${packageId}`,
      );
    }
    return saidPackage;
  }
}
