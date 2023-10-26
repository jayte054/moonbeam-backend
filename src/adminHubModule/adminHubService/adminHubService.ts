import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  AdminHubDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminHubRepository } from '../adminHubRepository/adminHubRepository';
import { ProductEntity } from '../productEntity/productEntity';
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

  getProductRates = async (): Promise<ProductRateEntity[]> => {
    return await this.adminHubRepository.getProductRates();
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

  uploadProduct = async (
    uploadProductDto: UploadProductDto,
    admin: AdminAuthEntity,
    req: Request,
  ): Promise<ProductEntity | any> => {
    return await this.adminHubRepository.uploadProduct(
      uploadProductDto,
      admin,
      req,
    );
  };
}
