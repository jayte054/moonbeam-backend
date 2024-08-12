import { Controller, Get } from '@nestjs/common';
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductEntity } from '../productEntity/productEntity';
import { SurprisePackageEntity } from '../surprisePackageEntity/surprisePackageEntity';

@Controller('bareAdminHub')
export class BareAdminHubController {
  constructor(private readonly adminHubService: AdminHubService) {}

  @Get('/getProductsGallery')
  async getProductsGallery(): Promise<ProductEntity[]> {
    return await this.adminHubService.getProductsGallery();
  }

  @Get('/getSurprisePackages')
  async getSurprisePackages(): Promise<SurprisePackageEntity[]> {
    return await this.adminHubService.getSurprisePackages();
  }

  @Get('/getCakeVariantsRates')
  async getCakeVariants() {
    return await this.adminHubService.getCakeVariantRates();
  }
}
