import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Request } from 'express';
import {
  AdminHubDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import { ProductEntity } from '../productEntity/productEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { ProductType } from 'src/products/ProductEnum/productEnum';

@Injectable()
export class AdminHubRepository extends Repository<ProductRateEntity> {
  private logger = new Logger('AdminHubRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ProductRateEntity, dataSource.createEntityManager());
  }

  //======Product Rates=========

  productRate = async (
    admin: AdminAuthEntity,
    adminHubDto: AdminHubDto,
  ): Promise<ProductRateEntity | any> => {
    const {
      chocolateCakeRate,
      strawberryCakeRate,
      vanillaCakeRate,
      redvelvetCakeRate,
      carrotCakeRate,
      cheeseCakeRate,
      bananaCakeRate,
      appleCakeRate,
      lemonCakeRate,
      coffeeCakeRate,
      coconutCakeRate,
      blueberryCakeRate,
    } = adminHubDto;

    const rate = new ProductRateEntity();

    rate.rateId = uuid();
    rate.chocolateCakeRate = chocolateCakeRate;
    rate.strawberryCakeRate = strawberryCakeRate;
    rate.vanillaCakeRate = vanillaCakeRate;
    rate.redvelvetCakeRate = redvelvetCakeRate;
    rate.carrotCakeRate = carrotCakeRate;
    rate.cheeseCakeRate = cheeseCakeRate;
    rate.bananaCakeRate = bananaCakeRate;
    rate.appleCakeRate = appleCakeRate;
    rate.lemonCakeRate = lemonCakeRate;
    rate.coffeeCakeRate = coffeeCakeRate;
    rate.coconutCakeRate = coconutCakeRate;
    rate.blueberryCakeRate = blueberryCakeRate;
    rate.admin = admin;

    try {
      await rate.save();
      this.logger.verbose(
        `new cake rate with id ${rate.rateId} has been successfully saved by admin`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`error saving new cake rate`);
      throw new InternalServerErrorException('error saving new cake rate');
    }

    return {
      rateId: rate.rateId,
      chocolateCakeRate: rate.cheeseCakeRate,
      strawberryCakeRate: rate.strawberryCakeRate,
      vanillaCakeRate: rate.vanillaCakeRate,
      redvelvetCakeRate: rate.redvelvetCakeRate,
      carrotCakeRate: rate.carrotCakeRate,
      cheeseCakeRate: rate.cheeseCakeRate,
      bananaCakeRate: rate.bananaCakeRate,
      appleCakeRate: rate.appleCakeRate,
      lemonCakeRate: rate.lemonCakeRate,
      coffeeCakeRate: rate.coffeeCakeRate,
      coconutCakeRate: rate.coconutCakeRate,
      blueberryCakeRate: rate.blueberryCakeRate,
    };
  };

  getProductRates = async (): Promise<ProductRateEntity[]> => {
    const options: FindOneOptions<ProductRateEntity> = {};

    const rates = await this.find(options);
    if (!rates) {
      this.logger.error('rates not found');
      throw new NotFoundException('rates not found');
    }
    this.logger.verbose('rates fetches successfully');
    return rates;
  };

  getProductRateWithId = async (
    rateId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> => {
    const productRateWithId = await this.findOne({
      where: {
        rateId,
        // adminId: admin.id,
      },
    });

    if (!productRateWithId) {
      throw new NotFoundException(`product rate with id ${rateId} not found`);
    }

    try {
      this.logger.verbose(
        `product rate with id ${rateId} successfully fetched`,
      );
      return productRateWithId;
    } catch (error) {
      this.logger.error(
        `product rate with id ${rateId} was not successfully fetched`,
      );
      throw new InternalServerErrorException();
    }
  };

  updateProductRate = async (
    rateId: string,
    user: AdminAuthEntity,
    updateAdminHubDto: UpdateProductRateDto,
  ): Promise<ProductRateEntity | any> => {
    const {
      chocolateCakeRate,
      strawberryCakeRate,
      vanillaCakeRate,
      redvelvetCakeRate,
      carrotCakeRate,
      cheeseCakeRate,
      bananaCakeRate,
      appleCakeRate,
      lemonCakeRate,
      coffeeCakeRate,
      coconutCakeRate,
      blueberryCakeRate,
    } = updateAdminHubDto;

    const rates = await this.getProductRateWithId(rateId, user);

    rates.chocolateCakeRate = chocolateCakeRate;
    rates.strawberryCakeRate = strawberryCakeRate;
    rates.vanillaCakeRate = vanillaCakeRate;
    rates.redvelvetCakeRate = redvelvetCakeRate;
    rates.carrotCakeRate = carrotCakeRate;
    rates.cheeseCakeRate = cheeseCakeRate;
    rates.bananaCakeRate = bananaCakeRate;
    rates.appleCakeRate = appleCakeRate;
    rates.lemonCakeRate = lemonCakeRate;
    rates.coffeeCakeRate = coffeeCakeRate;
    rates.coconutCakeRate = coconutCakeRate;
    rates.blueberryCakeRate = blueberryCakeRate;

    try {
      await rates.save();
      this.logger.verbose(
        `productRate with id ${rateId} has been successfully updated`,
      );
    } catch (error) {
      this.logger.error(`failed to update product rate with id ${rateId}`);
      return 'error updating product rate';
    }

    return rates;
  };

  //======== Products =========

  uploadProduct = async (
    uploadProductDto: UploadProductDto,
    admin: AdminAuthEntity,
    req: Request,
  ): Promise<ProductEntity | any> => {
    const { type, description } = uploadProductDto;

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);

    const product = new ProductEntity();
    // product.productId = uuid();
    product.type = type;
    product.imageUrl = cloudinaryUrl.secure_url;
    product.description = description;
    product.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    product.admin = admin;

    try {
      await product.save();
      this.logger.verbose(
        `product with id ${product.productId} saved successfully`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`error uploading product`);
      throw new InternalServerErrorException(' error uploading product');
    }

    return {
      id: product.productId,
      type: product.type,
      imageUrl: product.imageUrl,
      description: product.description,
      date: product.date,
      //   adminId: product.admin.id,
    };
  };
}
