import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { AdminHubDto, UpdateProductRateDto } from '../adminHubDto/adminHubDto';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';

@Injectable()
export class AdminProductRateRepository extends Repository<ProductRateEntity> {
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
      samosaRate,
      springRollRate,
      samosa_springrollRate,
      puffRate,
      pepperedMeatRate,
      puff_pepperedMeatRate,
      samosa_pepperedMeatRate,
      springroll_pepperedMeatRate,
      meatPieRate,
      donutsRate,
      cinamonRollsRate,
      pancakesRate,
      corndogsRate,
      waffelsRate,
      meatpie_donutsRate,
      pancakes_corndogs_waffelsRate,
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
    rate.samosaRate = samosaRate;
    rate.springRollRate = springRollRate;
    rate.samosa_springrollRate = samosa_springrollRate;
    rate.puffRate = puffRate;
    rate.pepperedMeatRate = pepperedMeatRate;
    rate.puff_pepperedMeatRate = puff_pepperedMeatRate;
    rate.samosa_pepperedMeatRate = samosa_pepperedMeatRate;
    rate.springroll_pepperedMeatRate = springroll_pepperedMeatRate;
    rate.meatPieRate = meatPieRate;
    rate.donutsRate = donutsRate;
    rate.cinamonRollsRate = cinamonRollsRate;
    rate.pancakesRate = pancakesRate;
    rate.corndogsRate = corndogsRate;
    rate.waffelsRate = waffelsRate;
    rate.meatpie_donutsRate = meatpie_donutsRate;
    rate.pancakes_corndogs_waffelsRate = pancakes_corndogs_waffelsRate;
    rate.admin = admin;

    try {
      if (admin.isAdmin === true) {
        await rate.save();
        this.logger.verbose(
          `new cake rate with id ${rate.rateId} has been successfully saved by admin ${rate.adminId}`,
        );
      } else {
        this.logger.debug(`user is not admin`);
        return 'user is not admin';
      }
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
      samosaRate: rate.samosaRate,
      springRollRate: rate.springRollRate,
      samosa_springrollRate: rate.samosa_springrollRate,
      puffRate: rate.puffRate,
      pepperedMeatRate: rate.pepperedMeatRate,
      puff_pepperedMeatRate: rate.puff_pepperedMeatRate,
      samosa_pepperedMeatRate: rate.samosa_pepperedMeatRate,
      springroll_pepperedMeatRate: rate.springroll_pepperedMeatRate,
      meatPieRate: rate.meatPieRate,
      donutsRate: rate.donutsRate,
      cinamonRollsRate: rate.cinamonRollsRate,
      pancakesRate: rate.pancakesRate,
      corndogsRate: rate.corndogsRate,
      waffelsRate: rate.waffelsRate,
      meatpie_donutsRate: rate.meatpie_donutsRate,
      pancakes_corndogs_waffelsRate: rate.pancakes_corndogs_waffelsRate,
      adminId: rate.adminId,
    };
  };

  getProductRates = async (
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity[]> => {
    const options: FindOneOptions<ProductRateEntity> = {};

    const rates = await this.find(options);
    if (!rates) {
      this.logger.error('rates not found');
      throw new NotFoundException('rates not found');
    }
    this.logger.verbose(`rates fetched successfully by admin ${admin.id}`);
    return rates;
  };

  getProductRateWithId = async (
    rateId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> => {
    const productRateWithId = await this.findOne({
      where: {
        rateId,
        adminId: admin.id,
      },
    });

    if (!productRateWithId) {
      throw new NotFoundException(`product rate with id ${rateId} not found`);
    }

    try {
      this.logger.verbose(
        `product rate with id ${rateId} successfully fetched by admin ${admin.id}`,
      );
      return productRateWithId;
    } catch (error) {
      this.logger.error(
        `product rate with id ${rateId} was not successfully fetched`,
      );
      throw new InternalServerErrorException(
        `fetching rate with id ${rateId} unsuccessful`,
      );
    }
  };

  updateProductRate = async (
    rateId: string,
    admin: AdminAuthEntity,
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
      samosaRate,
      springRollRate,
      samosa_springrollRate,
      puffRate,
      pepperedMeatRate,
      puff_pepperedMeatRate,
      samosa_pepperedMeatRate,
      springroll_pepperedMeatRate,
      meatPieRate,
      donutsRate,
      cinamonRollsRate,
      pancakesRate,
      corndogsRate,
      waffelsRate,
      meatpie_donutsRate,
      pancakes_corndogs_waffelsRate,
    } = updateAdminHubDto;

    const rates = await this.getProductRateWithId(rateId, admin);

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
    rates.samosaRate = samosaRate;
    rates.springRollRate = springRollRate;
    rates.samosa_springrollRate = samosa_springrollRate;
    rates.puffRate = puffRate;
    rates.pepperedMeatRate = pepperedMeatRate;
    rates.puff_pepperedMeatRate = puff_pepperedMeatRate;
    rates.samosa_pepperedMeatRate = samosa_pepperedMeatRate;
    rates.springroll_pepperedMeatRate = springroll_pepperedMeatRate;
    rates.meatPieRate = meatPieRate;
    rates.donutsRate = donutsRate;
    rates.cinamonRollsRate = cinamonRollsRate;
    rates.pancakesRate = pancakesRate;
    rates.corndogsRate = corndogsRate;
    rates.waffelsRate = waffelsRate;
    rates.meatpie_donutsRate = meatpie_donutsRate;
    rates.pancakes_corndogs_waffelsRate = pancakes_corndogs_waffelsRate;

    try {
      if (admin.isAdmin === true) {
        await rates.save();
        this.logger.verbose(
          `productRate with id ${rateId} has been successfully updated by admin ${rates.adminId}`,
        );
      } else {
        this.logger.debug(`user is not admin`);
        return 'user is not admin';
      }
    } catch (error) {
      this.logger.error(`failed to update product rate with id ${rateId}`);
      return 'error updating product rate';
    }

    return rates;
  };
}
