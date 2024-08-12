import {
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Request,
  Body,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  Get,
  Param,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import {
  CustomProductOrderDto,
  GenericProductOrderDto,
  UpdateOrderDto,
  GenericChopsOrderDto,
  SurprisePackageOrderDto,
  UpdateGenericChopsOrderDto,
  UpdateSurprisePackageOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductService } from '../productOrderService/productOrderService';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ChopsOrderType } from '../productOrderRepository/chopsOrderRepository';
import {
  bronzePackageOrderType,
  diamondPackageOrderType,
  goldPackageOrderType,
  silverPackageOrderType,
} from 'src/types';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderEntity } from '../productOrderEntity/budgetCakeOrderEntity';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/postCustomOrder')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async postOrder(
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() customProductOrderDto?: CustomProductOrderDto,
  ): Promise<ProductOrderEntity | any> {
    console.log('wahala');
    return await this.productService.createCustomProductOrder(
      customProductOrderDto,
      user,
      req,
    );
  }

  //the title of the file on postman has to be descrbed as file

  @Post('/postGenericOrder')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async genericProductOrder(
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() genericProductOrderDto?: GenericProductOrderDto,
  ): Promise<ProductOrderEntity | any> {
    console.log('wahala');

    return await this.productService.genericProductOrder(
      genericProductOrderDto,
      user,
      req,
    );
  }

  @Post('/budgetCakeOrder')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async budgetCakeOrder(
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() genericProductOrderDto?: GenericProductOrderDto,
  ): Promise<BudgetCakeOrderEntity | any> {
    console.log('wahala');

    return await this.productService.budgetCakeOrder(
      genericProductOrderDto,
      user,
      req,
    );
  }

  @Post('/postGenericChopsOrder')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async genericChopsOrder(
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
    @Body() genericChopsOderDto: GenericChopsOrderDto,
  ): Promise<ChopsOrderType> {
    return await this.productService.genericChopsOrder(
      genericChopsOderDto,
      user,
      req,
    );
  }

  @Post('/bronzePackageOrder')
  @UsePipes(ValidationPipe)
  async bronzePackageOrder(
    @GetUser() user: AuthEntity,
    @Body() surprisePackageOrderDto: SurprisePackageOrderDto,
  ): Promise<bronzePackageOrderType> {
    return await this.productService.bronzePackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  @Post('/silverPackageOrder')
  @UsePipes(ValidationPipe)
  async silverPackageOrder(
    @GetUser() user: AuthEntity,
    @Body() surprisePackageOrderDto: SurprisePackageOrderDto,
  ): Promise<silverPackageOrderType> {
    return await this.productService.silverPackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  @Post('/goldPackageOrder')
  @UsePipes(ValidationPipe)
  async goldPackageOrder(
    @GetUser() user: AuthEntity,
    @Body() surprisePackageOrderDto: SurprisePackageOrderDto,
  ): Promise<goldPackageOrderType> {
    return await this.productService.goldPackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  @Post('/diamondPackageOrder')
  @UsePipes(ValidationPipe)
  async diamondPackageOrder(
    @GetUser() user: AuthEntity,
    @Body() surprisePackageOrderDto: SurprisePackageOrderDto,
  ): Promise<diamondPackageOrderType> {
    return await this.productService.diamondPackageOrder(
      surprisePackageOrderDto,
      user,
    );
  }

  @Get('/getOrders')
  async getOrders(@GetUser() user: AuthEntity): Promise<ProductOrderEntity[]> {
    return await this.productService.getOrders(user);
  }

  @Get('/getChopsOrder')
  async getChopsOrder(
    @GetUser() user: AuthEntity,
  ): Promise<ChopsOrderEntity[] | any> {
    console.log('chops');
    return await this.productService.getChopsOrders(user);
  }

  @Get('/getSurprisePackageOrders')
  async getSurprisePackageOrder(
    @GetUser() user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity[]> {
    return await this.productService.getSurprisePackageOrders(user);
  }

  @Get('/:id')
  getOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return this.productService.getOrderWithId(id, user);
  }

  @Get('/getChopOrder/:id')
  async getChopOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ChopsOrderEntity> {
    return await this.productService.getChopOrderWithId(id, user);
  }

  @Patch('/updateChopOrder/:id')
  async updateChopOrder(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
    @Body() updateGenericChopsOrderDto: UpdateGenericChopsOrderDto,
  ): Promise<ChopsOrderEntity> {
    return await this.productService.updateChopOrders(
      id,
      user,
      updateGenericChopsOrderDto,
    );
  }

  @Get('/getSurprisePackageOrderWithId/:packageId')
  async getSurprisePackageOrderWithId(
    @Param('packageId') packageId: string,
    @GetUser() user: AuthEntity,
  ): Promise<SurprisePackageOrderEntity> {
    return await this.productService.getSurprisePackageOrderWithId(
      packageId,
      user,
    );
  }

  @Patch('/updateSurprisePacakgeOrder/:packageId')
  async updateSurprisePackageOrder(
    @Param('packageId') packageId: string,
    @GetUser() user: AuthEntity,
    @Body() updateSurprisePackageOrderDto: UpdateSurprisePackageOrderDto,
  ): Promise<SurprisePackageOrderEntity> {
    return await this.productService.updateSurprisePackageOrder(
      packageId,
      user,
      updateSurprisePackageOrderDto,
    );
  }

  @Patch('/:id/update')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateOrder(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
    @Body() updateOrderDto: UpdateOrderDto,
    // @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
  ): Promise<ProductOrderEntity> {
    console.log('wahala');
    return await this.productService.updateOrder(id, user, updateOrderDto, req);
  }

  @Put('/:id/cancelOrder')
  @UsePipes(ValidationPipe)
  async cancelOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return await this.productService.cancelOrder(id, user, updateOrderDto);
  }

  @Patch('/:id/deliverOrder')
  @UsePipes(ValidationPipe)
  async orderDelivered(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity | string> {
    return await this.productService.orderDelivered(id, user, updateOrderDto);
  }

  @Delete('/:id/deleteOrder')
  async deleteOrder(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<string> {
    return await this.productService.deleteOrder(id, user);
  }
}
