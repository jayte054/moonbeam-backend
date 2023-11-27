import { Controller, Get } from '@nestjs/common';
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductEntity } from '../productEntity/productEntity';

@Controller('bareAdminHub')
export class BareAdminHubController {
  constructor(private readonly adminHubService: AdminHubService) {}

  @Get('/getProductsGallery')
  async getProductsGallery(): Promise<ProductEntity[]> {
    return await this.adminHubService.getProductsGallery();
  }
}
