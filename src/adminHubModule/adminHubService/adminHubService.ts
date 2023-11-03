import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  AdminHubDto,
  UpdateProductDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminProductRateRepository } from '../adminProductRateRepository/adminProductRateRepository';
import { AdminProductRepository } from '../adminProductRepository/adminProductRepository';
import { ProductEntity } from '../productEntity/productEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';

@Injectable()
export class AdminHubService {
  constructor(
    @InjectRepository(AdminProductRateRepository)
    @InjectRepository(AdminProductRepository)
    private adminProductRateRepository: AdminProductRateRepository,
    private adminProductRepository: AdminProductRepository,
  ) {}

  productRate = async (
    admin: AdminAuthEntity,
    adminHubDto: AdminHubDto,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminProductRateRepository.productRate(
      admin,
      adminHubDto,
    );
  };

  getProductRates = async (
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity[]> => {
    return await this.adminProductRateRepository.getProductRates(admin);
  };

  getProductRateWithId = async (
    rateId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminProductRateRepository.getProductRateWithId(
      rateId,
      admin,
    );
  };

  updateProductRate = async (
    rateId: string,
    admin: AdminAuthEntity,
    updateProductRate: UpdateProductRateDto,
  ): Promise<ProductRateEntity | any> => {
    return await this.adminProductRateRepository.updateProductRate(
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
    return await this.adminProductRepository.uploadProduct(
      uploadProductDto,
      admin,
      req,
    );
  };

  getProducts = async (): Promise<ProductEntity[]> => {
    return await this.adminProductRepository.getProducts();
  };

  getProductsWithId = async (
    productId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductEntity> => {
    return await this.adminProductRepository.getProductsWithId(
      productId,
      admin,
    );
  };

  updateProduct = async (
    productId: string,
    admin: AdminAuthEntity,
    updateProductDto: UpdateProductDto,
    req?: Request,
  ): Promise<ProductEntity> => {
    return await this.adminProductRepository.updateProduct(
      productId,
      admin,
      updateProductDto,
      req,
    );
  };

  //   async getAllUsers(admin: AdminAuthEntity): Promise<any> {
  //     return await this.authRepository.getAllUsers(admin);
  //   }
}
