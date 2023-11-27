import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  AdminHubDto,
  ProductDesignRateDto,
  UpdateDesignRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminProductRateRepository } from '../adminProductRateRepository/adminProductRateRepository';
import { AdminProductRepository } from '../adminProductRepository/adminProductRepository';
import { AdminProductDesignRateRepository } from '../adminProductDesignRateRepository/adminProductDesignRateRepository';
import { ProductEntity } from '../productEntity/productEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import { ProductDesignRateEntity } from '../ProductDesignRateEntity/ProductDesignRateEntity';
import { fetchProfiles } from '../adminHubUtils/adminHubUtils';
@Injectable()
export class AdminHubService {
  private logger = new Logger('AdminHubService');
  constructor(
    @InjectRepository(AdminProductRateRepository)
    @InjectRepository(AdminProductRepository)
    @InjectRepository(AdminProductDesignRateRepository)
    private adminProductRateRepository: AdminProductRateRepository,
    private adminProductRepository: AdminProductRepository,
    private adminProductDesignRateRepository: AdminProductDesignRateRepository,
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

  getProducts = async (admin: AdminAuthEntity): Promise<ProductEntity[]> => {
    return await this.adminProductRepository.getProducts(admin);
  };

  getProductsGallery = async (): Promise<ProductEntity[]> => {
    return await this.adminProductRepository.getProductsGallery();
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

  productDesignRate = async (
    admin: AdminAuthEntity,
    productDesignRateDto: ProductDesignRateDto,
  ): Promise<ProductDesignRateEntity | any> => {
    return await this.adminProductDesignRateRepository.productDesignRate(
      admin,
      productDesignRateDto,
    );
  };

  getProductDesignRates = async (
    admin: AdminAuthEntity,
  ): Promise<ProductDesignRateEntity[]> => {
    return await this.adminProductDesignRateRepository.getProductDesignRates(
      admin,
    );
  };

  getProductDesignRateWithId = async (
    designId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductDesignRateEntity> => {
    console.log(designId);
    return await this.adminProductDesignRateRepository.getProductDesignRateWithId(
      designId,
      admin,
    );
  };

  updateDesignRate = async (
    designId: string,
    admin: AdminAuthEntity,
    updateDesignRateDto: UpdateDesignRateDto,
  ): Promise<ProductDesignRateEntity | string> => {
    return await this.adminProductDesignRateRepository.updateDesignRate(
      designId,
      admin,
      updateDesignRateDto,
    );
  };

  fetchProfiles = async (admin: AdminAuthEntity) => {
    const userProfiles = await fetchProfiles();
    try {
      this.logger.verbose(`user profiles fetched successfully by ${admin.id}`);
      return userProfiles;
    } catch (error) {
      this.logger.error(
        `user profiles unsuccessfully fetched by admin ${admin.id}`,
      );
      throw new NotFoundException('user profiles not found');
    }
  };
}
