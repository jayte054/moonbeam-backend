import { Controller, Get, Param, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminHubService } from '../adminHubService/adminHubService';
import { AdminStudioEntity } from '../adminStudioDetailsEntity/adminStudioDetailsEntity';
import { ProductEntity } from '../productGalleryEntity/productGalleryEntity';
import { ReadyToGoProductsEntity } from '../rtgProductsEntity/rtgProductsEntity';
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

  @Get('/getStudios')
  async getStudios (): Promise<AdminStudioEntity[]> {
    return await this.adminHubService.getStudios()
  }

  @Get('/getStudioWithId/:studioId')
  async getStudioWithId(
    @Param('studioId') studioId: string
  ): Promise<AdminStudioEntity> {
    return await this.adminHubService.getStudioWithId(
      studioId
    )
  }

  @Get("/getRtgProducts")
  async getRtgProducts(): Promise<ReadyToGoProductsEntity[]> {
    return await this.adminHubService.getRtgProducts()
  }

  @Patch('/defaultStudioAddress/:studioId')
  @UsePipes(ValidationPipe)
  async defautStudioAddress(studioId: string): Promise<AdminStudioEntity> {
    return await this.adminHubService.defaultStudioAddress(studioId)
  }
}
