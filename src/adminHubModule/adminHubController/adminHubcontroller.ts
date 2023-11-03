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
  UpdateProductDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductEntity } from '../productEntity/productEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';

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

  @Patch('updateProductRate/:id')
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
  async getProducts(): Promise<ProductEntity[]> {
    return await this.adminHubService.getProducts();
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

  //   @Get('/getAllUsers')
  //   @UsePipes(ValidationPipe)
  //   async getAllUsers(@GetUser() admin: AdminAuthEntity): Promise<any> {
  //     return await this.adminHubService.getAllUsers(admin);
  //   }
}
