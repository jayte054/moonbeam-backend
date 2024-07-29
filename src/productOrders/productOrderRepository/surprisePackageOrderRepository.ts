import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { MailerService } from 'src/mailerModule/mailerService';
import { SurprisePackageOrderDto } from '../productOrderDto/productOrderDto';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { OrderStatus } from '../ProductOrderEnum/productOrderEnum';
import { fetchPackages } from '../productUtility';
import { bronzePackageOrderType } from 'src/types';

@Injectable()
export class SurprisePackageOrderRepository extends Repository<SurprisePackageOrderEntity> {
  private logger = new Logger('SurprisePackageOrderRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private mailerService: MailerService,
  ) {
    super(SurprisePackageOrderEntity, dataSource.createEntityManager());
  }

  async bronzePackageOrder(
    surprisePackageOrderDto: SurprisePackageOrderDto,
    user: AuthEntity,
  ): Promise<bronzePackageOrderType> {
    const { packageOrderName, deliveryDate, addInfo } = surprisePackageOrderDto;

    const setBronzePackage: any = await fetchPackages();
    console.log(setBronzePackage.bronzePackage);
    const bronzePackageData: any = setBronzePackage.bronzePackage;

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
    try {
      await packageOrder.save();
      await this.mailerService.bronzePackageOrderMail(user.email, packageOrder);
      this.logger.verbose(`
        user with id ${user.id} has successfully placed with order ${packageOrder.packageOrderName}
        `);
    } catch (error) {
      this.logger.error(
        `failed to complete packageOrder with name ${packageOrderName}`,
      );
      console.log(error);
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
}
