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
import { GetAdmin } from 'src/authModule/getAdminDecorator/getAdminDecorator';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
// import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import {
  AdminHubDto,
  UpdateProductRateDto,
  UploadProductDto,
} from '../adminHubDto/adminHubDto';
import { AdminHubService } from '../adminHubService/adminHubService';
import { ProductEntity } from '../productEntity/productEntity';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';

@Controller('adminHub')
// @UseGuards(AuthGuard())
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
  async getProductRates(): Promise<ProductRateEntity[]> {
    return this.adminHubService.getProductRates();
  }

  @Get('/getProductRateWithId/:rateId')
  @UsePipes(ValidationPipe)
  async getProductRateWithId(
    @Param('rateId') rateId: string,
    @GetAdmin() admin: AdminAuthEntity,
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
    @GetAdmin() admin: AdminAuthEntity,
    @Request() req: Request | any,
    @Body() uploadProductDto: UploadProductDto,
  ): Promise<ProductEntity | any> {
    return await this.adminHubService.uploadProduct(
      uploadProductDto,
      admin,
      req,
    );
  }
}
