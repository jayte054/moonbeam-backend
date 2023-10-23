import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AdminHubDto, UpdateProductRateDto } from '../adminHubDto/adminHubDto';
import { AdminHubRepository } from '../adminHubRepository/adminHubRepository';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';

@Injectable()
export class AdminHubService {
  constructor(
    @InjectRepository(AdminHubRepository)
    private adminHubRepository: AdminHubRepository,
  ) {}

  productRate = async (
    admin: AdminAuthEntity,
    adminHubDto: AdminHubDto,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminHubRepository.productRate(admin, adminHubDto);
  };

  getProductRateWithId = async (
    rateId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminHubRepository.getProductRateWithId(rateId, admin);
  };

  updateProductRate = async (
    rateId: string,
    admin: AdminAuthEntity,
    updateProductRate: UpdateProductRateDto,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminHubRepository.updateProductRate(
      rateId,
      admin,
      updateProductRate,
    );
  };
}
