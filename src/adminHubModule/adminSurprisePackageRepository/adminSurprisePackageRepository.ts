import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, FindOneOptions } from 'typeorm';
import { Request } from 'express';
import { SurprisePackageEntity } from '../surprisePackageEntity/surprisePackageEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  SurprisePackageDto,
  UpdateSurprisePackageDto,
} from '../adminHubDto/adminHubDto';
import { SurprisePackageObject } from '../types';

@Injectable()
export class SurprisePackageRepository extends Repository<SurprisePackageEntity> {
  private logger = new Logger('SurprisePackageRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(SurprisePackageEntity, dataSource.createEntityManager());
  }

  //=======Surprise package rates=========//

  surprisePackage = async (
    admin: AdminAuthEntity,
    surprisePackageDto: SurprisePackageDto,
    req: Request | any,
  ): Promise<SurprisePackageObject> => {
    const {
      packageName,
      itemOne,
      itemTwo,
      itemThree,
      itemFour,
      itemFive,
      itemSix,
      itemSeven,
      itemEight,
      itemNine,
      itemTen,
      itemEleven,
      itemTwelve,
      imageUrl,
      price,
      description,
    } = surprisePackageDto;

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);

    const surprisePackage = new SurprisePackageEntity();

    surprisePackage.packageName = packageName;
    surprisePackage.itemOne = itemOne;
    surprisePackage.itemTwo = itemTwo;
    surprisePackage.itemThree = itemThree;
    surprisePackage.itemFour = itemFour;
    surprisePackage.itemFive = itemFive;
    surprisePackage.itemSix = itemSix;
    surprisePackage.itemSeven = itemSeven;
    surprisePackage.itemEight = itemEight;
    surprisePackage.itemNine = itemNine;
    surprisePackage.itemTen = itemTen;
    surprisePackage.itemEleven = itemEleven;
    surprisePackage.itemTwelve = itemTwelve;
    surprisePackage.imageUrl = cloudinaryUrl.secure_url;
    surprisePackage.price = price;
    surprisePackage.description = description;
    surprisePackage.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    surprisePackage.admin = admin;

    try {
      if (admin.isAdmin === true) {
        await surprisePackage.save();
        this.logger.verbose(`
                    new package with package name ${surprisePackage.packageName} has been successfully created
                `);
        return {
          packageName: surprisePackage.packageName,
          itemOne: surprisePackage.itemOne,
          itemTwo: surprisePackage.itemTwo,
          itemThree: surprisePackage.itemThree,
          itemFour: surprisePackage.itemFour,
          itemFive: surprisePackage.itemFive,
          itemSix: surprisePackage.itemSix,
          itemSeven: surprisePackage.itemSeven,
          itemEight: surprisePackage.itemEight,
          itemNine: surprisePackage.itemNine,
          itemTen: surprisePackage.itemTen,
          itemEleven: surprisePackage.itemEleven,
          itemTwelve: surprisePackage.itemTwelve,
          imageUrl: surprisePackage.imageUrl,
          price: surprisePackage.price,
          description: surprisePackage.description,
          date: surprisePackage.date,
          adminId: admin.id,
        };
      }
    } catch (error) {
      this.logger.error('error saving package');
      throw new InternalServerErrorException();
    }
  };

  getSurprisePackages = async (
    admin: AdminAuthEntity,
  ): Promise<SurprisePackageEntity[]> => {
    const options: FindOneOptions<SurprisePackageEntity> = {};

    const packages = await this.find(options);
    if (!options) {
      this.logger.error('packages not found');
      throw new NotFoundException('packages not found');
    } else {
      this.logger.verbose(`packages fetched successfully by admin ${admin.id}`);
      return packages;
    }
  };

  getPackageWithId = async (
    packageId: string,
    admin: AdminAuthEntity,
  ): Promise<SurprisePackageEntity> => {
    const packageWithId = await this.findOne({
      where: {
        packageId,
        adminId: admin.id,
      },
    });

    if (!packageWithId) {
      this.logger.verbose(`
                package with id ${packageId} does not exist
            `);
      throw new NotFoundException(`
                package with id ${packageId} does not exist
            `);
    }
    try {
      this.logger.verbose(`
                successfully fetched package with id ${packageId}
            `);
      return packageWithId;
    } catch (error) {
      this.logger.error(`
                failed to fetch package with id ${packageId}
            `);
      throw new InternalServerErrorException(`
                failed to fetch package with id ${packageId}
            `);
    }
  };

  updateSurprisePackage = async (
    admin: AdminAuthEntity,
    updateSurprisePackageDto: UpdateSurprisePackageDto,
    packageId: string,
    req: Request,
  ): Promise<SurprisePackageObject> => {
    const {
      packageName,
      itemOne,
      itemTwo,
      itemThree,
      itemFour,
      itemFive,
      itemSix,
      itemSeven,
      itemEight,
      itemNine,
      itemTen,
      itemEleven,
      itemTwelve,
      file,
      price,
      description,
    } = updateSurprisePackageDto;
    console.log(packageId);

    const saidPackage = await this.getPackageWithId(packageId, admin);
    console.log(saidPackage);

    if (file) {
      const newImage = await this.cloudinaryService.uploadImage(req.file);

      if (saidPackage.imageUrl) {
        const oldPublicId = this.extractPublicId(saidPackage.imageUrl);
        await this.cloudinaryService.deleteImage(oldPublicId);
      }
      saidPackage.imageUrl = newImage.secure_url;
    }

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);

    saidPackage.packageName = packageName;
    saidPackage.itemOne = itemOne;
    saidPackage.itemTwo = itemTwo;
    saidPackage.itemThree = itemThree;
    saidPackage.itemFour = itemFour;
    saidPackage.itemFive = itemFive;
    saidPackage.itemSix = itemSix;
    saidPackage.itemSeven = itemSeven;
    saidPackage.itemEight = itemEight;
    saidPackage.itemNine = itemNine;
    saidPackage.itemTen = itemTen;
    saidPackage.itemEleven = itemEleven;
    saidPackage.itemTwelve = itemTwelve;
    saidPackage.price = price;
    saidPackage.description = description;

    try {
      if (admin.isAdmin === true) {
        await saidPackage.save();
        this.logger.verbose(`
                successfuly updated package with id ${packageId}
            `);
        return saidPackage;
      } else {
        this.logger.debug(`
                    user is not admin
                `);
      }
    } catch (error) {
      this.logger.error(`
                failed to update package with id ${packageId}
            `);
    }
  };

  private extractPublicId(imageUrl: string): string {
    // Extract the public_id from the imageUrl
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }
}
