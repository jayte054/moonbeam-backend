import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import {
  ProductDesignRateDto,
  UpdateDesignRateDto,
} from '../adminHubDto/adminHubDto';
import { ProductDesignRateEntity } from '../ProductDesignRateEntity/ProductDesignRateEntity';

@Injectable()
export class AdminProductDesignRateRepository extends Repository<ProductDesignRateEntity> {
  private logger = new Logger('ProductDesignRateRepository');
  constructor(private dataSource: DataSource) {
    super(ProductDesignRateEntity, dataSource.createEntityManager());
  }

  //======desgin rate=======

  productDesignRate = async (
    admin: AdminAuthEntity,
    productDesignRateDto: ProductDesignRateDto,
  ): Promise<ProductDesignRateEntity | any> => {
    const { butterCreamRate, fundantRate, nakedRate } = productDesignRateDto;

    const rate = new ProductDesignRateEntity();

    rate.designId = uuid();
    rate.butterCreamRate = butterCreamRate;
    rate.fundantRate = fundantRate;
    rate.nakedRate = nakedRate;
    rate.admin = admin;
    try {
      if (admin.isAdmin === true) {
        await rate.save();
        this.logger.verbose(
          `new design rate with id ${rate.designId} has been successfully saved by admin ${rate.adminId}`,
        );
      } else {
        this.logger.debug(`user is not admin`);
        return 'user is not an admin';
      }
    } catch (error) {
      this.logger.error(`error saving new design rate`);
      throw new InternalServerErrorException(`erroe saving new design rate`);
    }

    return {
      rateId: rate.designId,
      butterCreamRate: rate.butterCreamRate,
      fundantRate: rate.fundantRate,
      nakedrate: rate.nakedRate,
      adminId: rate.adminId,
    };
  };

  getProductDesignRates = async (
    admin: AdminAuthEntity,
  ): Promise<ProductDesignRateEntity[]> => {
    const options: FindOneOptions<ProductDesignRateEntity> = {};

    const rates = await this.find(options);

    if (!rates) {
      this.logger.error('design rates not found');
      throw new NotFoundException('rates not found');
    }
    this.logger.verbose(`rates fetched successfully by admin ${admin.id}`);
    return rates;
  };

  getProductDesignRateWithId = async (
    designId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductDesignRateEntity | any> => {
    const designRateWithId = await this.findOne({
      where: {
        designId,
        adminId: admin.id,
      },
    });

    if (!designRateWithId) {
      throw new NotFoundException(`product with id ${designId} not found`);
    }

    try {
      this.logger.verbose(`product with id ${designId} fetched successfully`);
      return designRateWithId;
    } catch (error) {
      await this.logger.error(
        `product with id ${designId} fetched unsuccessfully`,
      );
      throw new NotFoundException('product not found');
    }
  };

  updateDesignRate = async (
    designId: string,
    admin: AdminAuthEntity,
    updateDesignRateDto: UpdateDesignRateDto,
  ): Promise<ProductDesignRateEntity | string> => {
    const { nakedRate, butterCreamRate, fundantRate } = updateDesignRateDto;

    const designRate = await this.getProductDesignRateWithId(designId, admin);

    designRate.nakedRate = nakedRate;
    designRate.butterCreamRate = butterCreamRate;
    designRate.fundantRate = fundantRate;

    try {
      if (admin.isAdmin === true) {
        await designRate.save();
        this.logger.verbose(
          `designRate with Id ${designId} successfully updated by admin ${admin.id}`,
        );
      } else {
        return 'user is not an admin';
      }
    } catch (error) {
      this.logger.error(`error update design rate with id {designId}`);
      throw new InternalServerErrorException('error updating design');
    }
    return designRate;
  };
}
