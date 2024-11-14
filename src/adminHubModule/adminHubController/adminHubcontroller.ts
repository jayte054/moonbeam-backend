import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
// import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
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
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductDesignRateEntity } from '../ProductDesignRateEntity/ProductDesignRateEntity';
import { ProductEntity } from '../productGalleryEntity/productGalleryEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import {
  SurprisePackageDto,
  UpdateSurprisePackageDto,
} from '../adminHubDto/adminHubDto';
import {
  rtgProductObject,
  StudioObject,
  SurprisePackageObject,
} from '../types';
import { SurprisePackageEntity } from '../surprisePackageEntity/surprisePackageEntity';
import { BudgetCakeRateEntity } from '../productRateEntity/budgetCakeRateEntity';
import { AdminStudioEntity } from '../adminStudioDetailsEntity/adminStudioDetailsEntity';
// import { Request as Req, Request } from 'express';
import { ReadyToGoProductsEntity } from '../rtgProductsEntity/rtgProductsEntity';
import { GetAdmin } from 'src/authModule/getAdminDecorator/getAdminDecorator';

@Controller('adminHub')
@UseGuards(AuthGuard())
export class AdminHubController {
  constructor(private readonly adminHubService: AdminHubService) {}

  @Post('/setProductRate')
  @UsePipes(ValidationPipe)
  async productRate(
    @GetUser() admin: AdminAuthEntity,
    @Body() adminHubDto: AdminHubDto,
  ): Promise<ProductRateEntity | any> {
    return await this.adminHubService.productRate(admin, adminHubDto);
  }

  @Post('/uploadRtgProduct')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async uploadRtgProduct(
    @GetUser() admin: AdminAuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() uploadRtgProductDto: UploadRtgProductDto,
  ): Promise<rtgProductObject> {
    return await this.adminHubService.uploadRtgProduct(
      admin,
      req,
      uploadRtgProductDto,
    );
  }

  @Post('/setBudgetCakeRate')
  @UsePipes(ValidationPipe)
  async adminBudgetCakeRate(
    @GetUser() admin: AdminAuthEntity,
    @Body() adminBudgetHubDto: AdminBudgetHubDto,
  ): Promise<BudgetCakeRateEntity | any> {
    return await this.adminHubService.adminBudgetCakeRate(
      admin,
      adminBudgetHubDto,
    );
  }

  @Get('/getProductRates')
  async getProductRates(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductRateEntity[]> {
    return this.adminHubService.getProductRates(admin);
  }

  @Get('/getBudgetRates')
  async getBudgetCakeRates(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<BudgetCakeRateEntity[]> {
    return this.adminHubService.getBudgetCakeRates(admin);
  }

  @Get('/getRtgProductAuth')
  async getRtgProductsAuth(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ReadyToGoProductsEntity[]> {
    return this.adminHubService.getRtgProductsAuth(admin);
  }

  @Get('/getRtgProduct')
  async getRtgProducts(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ReadyToGoProductsEntity[]> {
    return this.adminHubService.getRtgProductsAuth(admin);
  }

  @Get('/getProductRateWithId/:rateId')
  @UsePipes(ValidationPipe)
  async getProductRateWithId(
    @Param('rateId') rateId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> {
    return await this.adminHubService.getProductRateWithId(rateId, admin);
  }

  @Get('/getRtgProductsWithId/:reqId')
  async getRtgProductsWithId(
    @GetUser() admin: AdminAuthEntity,
    @Param('reqId') reqId: string,
  ): Promise<ReadyToGoProductsEntity> {
    return await this.adminHubService.getRtgProductsWithId(admin, reqId);
  }

  @Patch('updateProductRate/:rateId')
  @UsePipes(ValidationPipe)
  async updateProductRate(
    @Param('rateId') rateId: string,
    @GetUser() admin: AdminAuthEntity,
    @Body() updateProductRate: UpdateProductRateDto,
  ): Promise<ProductRateEntity | any> {
    return await this.adminHubService.updateProductRate(
      rateId,
      admin,
      updateProductRate,
    );
  }

  @Patch('updateBudgetCakeRate/:rateId')
  @UsePipes(ValidationPipe)
  async updateBudgetCakeRate(
    @Param('rateId') rateId: string,
    @GetUser() admin: AdminAuthEntity,
    @Body() updateProductRate: UpdateProductRateDto,
  ): Promise<BudgetCakeRateEntity | any> {
    return await this.adminHubService.updateBudgetCakeRate(
      rateId,
      admin,
      updateProductRate,
    );
  }

  @Patch('updateRtgProduct:rtgId')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateRtgProducts(
    @GetUser() admin: AdminAuthEntity,
    @Param('rtgId') rtgId: string,
    @Request() req: Request | any,
    @Body() updateRtgProductDto: UpdateRtgProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ReadyToGoProductsEntity> {
    return await this.adminHubService.updateRtgProduct(
      admin,
      rtgId,
      req,
      updateRtgProductDto,
      file,
    );
  }

  @Post('/uploadProduct')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async uploadProduct(
    // @GetAdmin() admin: AdminAuthEntity,
    @GetUser() admin: AdminAuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() uploadProductDto: UploadProductDto,
  ): Promise<ProductEntity | any> {
    return await this.adminHubService.uploadProduct(
      uploadProductDto,
      admin,
      req,
    );
  }

  @Get('/getProducts')
  async getProducts(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductEntity[]> {
    return await this.adminHubService.getProducts(admin);
  }

  @Get('/getProductWithId/:productId')
  async getProductsWithId(
    @Param('productId') productId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductEntity> {
    return await this.adminHubService.getProductsWithId(productId, admin);
  }

  @Patch('/updateProduct/:productId')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('productId') productId: string,
    @GetUser() admin: AdminAuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: Request | any,
  ): Promise<ProductEntity> {
    return await this.adminHubService.updateProduct(
      productId,
      admin,
      updateProductDto,
      req,
      file,
    );
  }

  @Post('/productDesignRate')
  @UsePipes(ValidationPipe)
  async productDesignRate(
    @GetUser() admin: AdminAuthEntity,
    @Body() productDesignRateDto: ProductDesignRateDto,
  ): Promise<ProductRateEntity | any> {
    return await this.adminHubService.productDesignRate(
      admin,
      productDesignRateDto,
    );
  }

  @Get('/getProductDesignRate')
  async getProductDesignRates(@GetUser() admin: AdminAuthEntity) {
    return await this.adminHubService.getProductDesignRates(admin);
  }

  @Get('/getProductDesignRateWithId/:id')
  async getProductDesignRateWithId(
    @Param('id') designId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductDesignRateEntity> {
    return await this.adminHubService.getProductDesignRateWithId(
      designId,
      admin,
    );
  }

  @Patch('/updateDesignRate/:designId')
  @UsePipes(ValidationPipe)
  async updateDesignRate(
    @Param('designId') designId: string,
    @GetUser() admin: AdminAuthEntity,
    @Body() updateDesignRateDto: UpdateDesignRateDto,
  ): Promise<ProductDesignRateEntity | string> {
    return await this.adminHubService.updateDesignRate(
      designId,
      admin,
      updateDesignRateDto,
    );
  }

  @Get('/fetchProfiles')
  async fetchProfiles(@GetUser() admin: AdminAuthEntity) {
    console.log('here');
    return await this.adminHubService.fetchProfiles(admin);
  }

  @Post('/surprisePackage')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async surprisePackage(
    @GetUser() admin: AdminAuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() surprisePackageDto: SurprisePackageDto,
  ): Promise<SurprisePackageObject | any> {
    return await this.adminHubService.surprisePackage(
      admin,
      surprisePackageDto,
      req,
    );
  }

  @Get('/getSurprisePackageWithId/:id')
  async getSurprisePackageWithId(
    @Param('id') packageId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<SurprisePackageEntity> {
    return await this.adminHubService.getPackageWithId(packageId, admin);
  }

  @Patch('/updateSurprisePackage/:packageId')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateSurprisePackage(
    @GetUser() admin: AdminAuthEntity,
    @Body() updateSurprisePackageDto: UpdateSurprisePackageDto,
    @Param('packageId') packageId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
  ): Promise<SurprisePackageObject> {
    console.log(packageId);
    return await this.adminHubService.updateSurprisePackage(
      admin,
      updateSurprisePackageDto,
      packageId,
      req,
      file,
    );
  }

  @Post('/createStudioDetails')
  @UsePipes(ValidationPipe)
  async createStudioDetails(
    @GetUser() admin: AdminAuthEntity,
    @Body() adminStudioDetailsDto: AdminStudioDetailsDto,
  ): Promise<StudioObject> {
    return await this.adminHubService.createStudioDetails(
      admin,
      adminStudioDetailsDto,
    );
  }

  @Patch('updateStudioDetails/:studioId')
  @UsePipes(ValidationPipe)
  async updateStudioDetails(
    @GetUser() admin: AdminAuthEntity,
    @Param('studioId') studioId: string,
    @Body() updateStudioDetailsDto: UpdateStudioDetailsDto,
  ): Promise<AdminStudioEntity> {
    return this.adminHubService.updateStudioDetails(
      admin,
      studioId,
      updateStudioDetailsDto,
    );
  }

  @Delete('/deleteProduct/:productId')
  async deleteProduct(
    @GetUser() admin: AdminAuthEntity,
    @Param('productId') productId: string,
  ): Promise<string> {
    return await this.adminHubService.deleteProduct(admin, productId);
  }

  @Delete('/deleteRtgProduct/:rtgId')
  async deleteRtgProduct(
    @GetUser() admin: AdminAuthEntity,
    @Param('rtgId') rtgId: string,
  ): Promise<string> {
    return await this.adminHubService.deleteRtgProduct(admin, rtgId);
  }
}
