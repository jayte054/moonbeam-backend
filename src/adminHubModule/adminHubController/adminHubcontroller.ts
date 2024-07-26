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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
// import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import {
  AdminHubDto,
  ProductDesignRateDto,
  UpdateDesignRateDto,
  UpdateProductDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductDesignRateEntity } from '../ProductDesignRateEntity/ProductDesignRateEntity';
import { ProductEntity } from '../productEntity/productEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';
import {SurprisePackageDto} from "../adminHubDto/adminHubDto"
import {SurprisePackageObject} from "../types";
import {SurprisePackageEntity} from '../surprisePackageEntity/surprisePackageEntity'

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

  @Get('/getProductRates')
  async getProductRates(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductRateEntity[]> {
    return this.adminHubService.getProductRates(admin);
  }

  @Get('/getProductRateWithId/:rateId')
  @UsePipes(ValidationPipe)
  async getProductRateWithId(
    @Param('rateId') rateId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<ProductRateEntity | any> {
    return await this.adminHubService.getProductRateWithId(rateId, admin);
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

  @Post('/uploadProduct')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async uploadProduct(
    @GetUser() admin: AdminAuthEntity,
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

  @Patch('/updateProduct/:ProductId')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('productId') productId: string,
    @GetUser() admin: AdminAuthEntity,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: Request | any,
  ): Promise<ProductEntity> {
    return await this.adminHubService.updateProduct(
      productId,
      admin,
      updateProductDto,
      req,
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

  @Patch('/updateDesignRate/:id')
  @UsePipes(ValidationPipe)
  async updateDesignRate(
    @Param('id') designId: string,
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

  @Post("/surprisePackage")
  @UsePipes(ValidationPipe)
  async surprisePackage(
    @GetUser() admin: AdminAuthEntity,
    @Body() surprisePackageDto: SurprisePackageDto
  ): Promise<SurprisePackageObject> {
    return await this.adminHubService.surprisePackage(
      admin,
      surprisePackageDto
    )
  }

  @Get("/getSurprisePackages")
  async getSurprisePackages(
    @GetUser() admin: AdminAuthEntity
  ): Promise<SurprisePackageEntity[]> {
    return await this.adminHubService.getSurprisePackages(
      admin
    )
  }

  @Get('/getSurprisePackageWithId/:id')
  async getSurprisePackageWithId(
    @Param("id") packageId: string,
    @GetUser() admin: AdminAuthEntity,
  ): Promise<SurprisePackageEntity> {
    console.log(packageId)
    return await this.adminHubService.getPackageWithId(
      packageId,
      admin
    )
  }

  @Patch("/updateSurprisePackage/:packageId")
  @UsePipes(ValidationPipe)
  async updateSurprisePackage(
    @GetUser() admin: AdminAuthEntity,
    @Body() surprisePackageDto: SurprisePackageDto,
    @Param("packageId") packageId: string
  ): Promise<SurprisePackageObject> {
    console.log(packageId)
    return await this.adminHubService.updateSurprisePackage(
      admin,
      surprisePackageDto,
      packageId
    )
  }
}
