import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  AdminBudgetHubDto,
  AdminHubDto,
  AdminStudioDetailsDto,
  ProductDesignRateDto,
  UpdateDesignRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
  UpdateRtgProductDto,
  UpdateStudioDetailsDto,
  UploadProductDto,
  UploadRtgProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminProductRateRepository } from '../adminProductRateRepository/adminProductRateRepository';
import { AdminProductGalleryRepository } from '../adminProductGalleryRepository/adminProductGalleryRepository';
import { AdminProductDesignRateRepository } from '../adminProductDesignRateRepository/adminProductDesignRateRepository';
import { ProductEntity } from '../productGalleryEntity/productGalleryEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import { ProductDesignRateEntity } from '../ProductDesignRateEntity/ProductDesignRateEntity';
import { SurprisePackageEntity } from '../surprisePackageEntity/surprisePackageEntity';
import { fetchProfiles } from '../adminHubUtils/adminHubUtils';
import { SurprisePackageRepository } from '../adminSurprisePackageRepository/adminSurprisePackageRepository';
import {
  SurprisePackageDto,
  UpdateSurprisePackageDto,
} from '../adminHubDto/adminHubDto';
import {
  rtgProductObject,
  StudioObject,
  SurprisePackageObject,
} from '../types';
import { AdminBudgetCakeRateRepository } from '../adminProductRateRepository/adminBudgetCakeRateRepository copy';
import { BudgetCakeRateEntity } from '../productRateEntity/budgetCakeRateEntity';
import { AdminStudioDetailsRepository } from '../adminStudioRepository/adminStudioRepository';
import { AdminStudioEntity } from '../adminStudioDetailsEntity/adminStudioDetailsEntity';
import { ReadyToGoProductsRepository } from '../rtgProductsRepository/rtgProductsRepository';
import { ReadyToGoProductsEntity } from '../rtgProductsEntity/rtgProductsEntity';
import {
  AdminHubOrderRepository,
  // fetchUserOrders,
} from '../adminHubOrderRepository/adminHubOrderRepository';
import { AllOrdersRepository } from 'src/productOrders/productOrderRepository/allOrdersRepository';
import { PaidOrdersDto } from 'src/types';

@Injectable()
export class AdminHubService {
  private logger = new Logger('AdminHubService');
  constructor(
    @InjectRepository(AdminProductRateRepository)
    private adminProductRateRepository: AdminProductRateRepository,
    @InjectRepository(AdminProductGalleryRepository)
    private adminProductRepository: AdminProductGalleryRepository,
    @InjectRepository(AdminProductDesignRateRepository)
    private adminProductDesignRateRepository: AdminProductDesignRateRepository,
    @InjectRepository(SurprisePackageRepository)
    private surprisePackageRepository: SurprisePackageRepository,
    @InjectRepository(AdminBudgetCakeRateRepository)
    private adminBudgetCakeRateRepository: AdminBudgetCakeRateRepository,
    @InjectRepository(AdminStudioDetailsRepository)
    private adminStudioDetailsRepository: AdminStudioDetailsRepository,
    @InjectRepository(ReadyToGoProductsRepository)
    private readyToGoProductsRepository: ReadyToGoProductsRepository,
    // @InjectRepository(AdminHubOrderRepository)
    private allOrdersRepository: AllOrdersRepository,
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

  uploadRtgProduct = async (
    admin: AdminAuthEntity,
    req: Request,
    uploadRtgProductDto: UploadRtgProductDto,
  ): Promise<rtgProductObject> => {
    return await this.readyToGoProductsRepository.uploadRtgProduct(
      admin,
      req,
      uploadRtgProductDto,
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

  getRtgProductsAuth = async (
    admin: AdminAuthEntity,
  ): Promise<ReadyToGoProductsEntity[]> => {
    return await this.readyToGoProductsRepository.getRtgProductsAuth(admin);
  };

  getRtgProducts = async (): Promise<ReadyToGoProductsEntity[]> => {
    return await this.readyToGoProductsRepository.getRtgProducts();
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

  getRtgProductsWithId = async (
    admin: AdminAuthEntity,
    rtgId: string,
  ): Promise<ReadyToGoProductsEntity> => {
    return await this.readyToGoProductsRepository.getRtgProductsWithId(
      admin,
      rtgId,
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

  fetchUserOrders = async (
    admin: AdminAuthEntity,
  ): Promise<PaidOrdersDto[]> => {
    if (!admin.isAdmin) {
      this.logger.error('user is not an admin');
      throw new InternalServerErrorException('user not allowed');
    }
    try {
      const orders = await this.allOrdersRepository.allPaidOrders();

      if (!orders) {
        this.logger.error('orders table empty');
        throw new NotFoundException('no orders to fetch');
      }
      return orders;
    } catch (error) {
      this.logger.error('failed to fetch orders');
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };

  updateProduct = async (
    productId: string,
    admin: AdminAuthEntity,
    updateProductDto: UpdateProductDto,
    req: Request,
    file: Express.Multer.File,
  ): Promise<ProductEntity> => {
    return await this.adminProductRepository.updateProduct(
      productId,
      admin,
      req,
      file,
      updateProductDto,
    );
  };

  updateRtgProduct = async (
    admin: AdminAuthEntity,
    rtgId: string,
    req: Request,
    updateRtgProductDto: UpdateRtgProductDto,
    file: Express.Multer.File,
  ): Promise<ReadyToGoProductsEntity> => {
    return await this.readyToGoProductsRepository.updateRtgProduct(
      admin,
      rtgId,
      req,
      updateRtgProductDto,
      file,
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
    file: Express.Multer.File,
  ): Promise<SurprisePackageObject> => {
    return await this.surprisePackageRepository.updateSurprisePackage(
      admin,
      updateSurprisePackageDto,
      packageId,
      req,
      file,
    );
  };

  createStudioDetails = async (
    admin: AdminAuthEntity,
    adminStudioDetailsDto: AdminStudioDetailsDto,
  ): Promise<StudioObject> => {
    return this.adminStudioDetailsRepository.createStudioDetails(
      admin,
      adminStudioDetailsDto,
    );
  };

  getStudios = async (): Promise<AdminStudioEntity[]> => {
    return await this.adminStudioDetailsRepository.getStudios();
  };

  getStudioWithId = async (studioId: string): Promise<AdminStudioEntity> => {
    return await this.adminStudioDetailsRepository.getStudioWithId(studioId);
  };

  updateStudioDetails = async (
    admin: AdminAuthEntity,
    studioId: string,
    updateStudioDetailsDto: UpdateStudioDetailsDto,
  ): Promise<AdminStudioEntity> => {
    return this.adminStudioDetailsRepository.updateStudioDetails(
      admin,
      studioId,
      updateStudioDetailsDto,
    );
  };

  defaultStudioAddress = async (
    studioId: string,
  ): Promise<AdminStudioEntity> => {
    return await this.adminStudioDetailsRepository.defaultStudioAddress(
      studioId,
    );
  };

  deleteRtgProduct = async (
    admin: AdminAuthEntity,
    rtgId: string,
  ): Promise<string> => {
    return await this.readyToGoProductsRepository.deleteRtgProduct(
      admin,
      rtgId,
    );
  };
  deleteProduct = async (
    admin: AdminAuthEntity,
    productId: string,
  ): Promise<string> => {
    return await this.adminProductRepository.deleteProduct(admin, productId);
  };
}
