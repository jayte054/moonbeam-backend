import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  AdminBudgetHubDto,
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
import { SurprisePackageEntity } from '../surprisePackageEntity/surprisePackageEntity';
import { fetchProfiles } from '../adminHubUtils/adminHubUtils';
import { SurprisePackageRepository } from '../adminSurprisePackageRepository/adminSurprisePackageRepository';
import {
  SurprisePackageDto,
  UpdateSurprisePackageDto,
} from '../adminHubDto/adminHubDto';
import { SurprisePackageObject } from '../types';
import { AdminBudgetCakeRateRepository } from '../adminProductRateRepository/adminBudgetCakeRateRepository copy';
import { BudgetCakeRateEntity } from '../productRateEntity/budgetCakeRateEntity';

@Injectable()
export class AdminHubService {
  private logger = new Logger('AdminHubService');
  constructor(
    @InjectRepository(AdminProductRateRepository)
    @InjectRepository(AdminProductRepository)
    @InjectRepository(AdminProductDesignRateRepository)
    @InjectRepository(SurprisePackageRepository)
    @InjectRepository(AdminBudgetCakeRateRepository)
    private adminProductRateRepository: AdminProductRateRepository,
    private adminProductRepository: AdminProductRepository,
    private adminProductDesignRateRepository: AdminProductDesignRateRepository,
    private surprisePackageRepository: SurprisePackageRepository,
    private adminBudgetCakeRateRepository: AdminBudgetCakeRateRepository,
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

  adminBudgetCakeRate = async (
    admin: AdminAuthEntity,
    adminBudgetHubDto: AdminBudgetHubDto,
  ): Promise<BudgetCakeRateEntity | any> => {
    return await this.adminBudgetCakeRateRepository.adminBudgetCakeRate(
      admin,
      adminBudgetHubDto,
    );
  };

  getProductRates = async (
    admin: AdminAuthEntity,
  ): Promise<ProductRateEntity[]> => {
    return await this.adminProductRateRepository.getProductRates(admin);
  };

  getBudgetCakeRates = async (
    admin: AdminAuthEntity,
  ): Promise<BudgetCakeRateEntity[]> => {
    return await this.adminBudgetCakeRateRepository.getBudgetCakeRates(admin);
  };

  getCakeVariantRates = async () => {
    return await this.adminBudgetCakeRateRepository.getCakeVariantRates();
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

  updateBudgetCakeRate = async (
    rateId: string,
    admin: AdminAuthEntity,
    updateProductRate: UpdateProductRateDto,
  ): Promise<BudgetCakeRateEntity | any> => {
    return await this.adminBudgetCakeRateRepository.updateBudgetCakeRate(
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

  surprisePackage = async (
    admin: AdminAuthEntity,
    surprisePackageDto: SurprisePackageDto,
    req: Request | any,
  ): Promise<SurprisePackageObject | any> => {
    return await this.surprisePackageRepository.surprisePackage(
      admin,
      surprisePackageDto,
      req,
    );
  };

  getSurprisePackages = async (): Promise<SurprisePackageEntity[]> => {
    return await this.surprisePackageRepository.getSurprisePackages();
  };

  getPackageWithId = async (
    packageId: string,
    admin: AdminAuthEntity,
  ): Promise<SurprisePackageEntity> => {
    return await this.surprisePackageRepository.getPackageWithId(
      packageId,
      admin,
    );
  };

  updateSurprisePackage = async (
    admin: AdminAuthEntity,
    updateSurprisePackageDto: UpdateSurprisePackageDto,
    packageId: string,
    req: Request,
  ): Promise<SurprisePackageObject> => {
    return await this.surprisePackageRepository.updateSurprisePackage(
      admin,
      updateSurprisePackageDto,
      packageId,
      req,
    );
  };
}
