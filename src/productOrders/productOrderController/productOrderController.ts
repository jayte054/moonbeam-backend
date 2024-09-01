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
  CustomPackageOrderDto,
  UpdateCustomPackageOrderDto,
  CreateChopsOrderDto,
  UpdateCustomChopOrderDto,
} from '../productOrderDto/productOrderDto';
import { ProductService } from '../productOrderService/productOrderService';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';
import { ChopsOrderType } from '../productOrderRepository/chopsOrderRepository';
import {
  bronzePackageOrderType,
  chopsOrderType,
  customPackageOrderType,
  diamondPackageOrderType,
  goldPackageOrderType,
  silverPackageOrderType,
} from 'src/types';
import { ChopsOrderEntity } from '../productOrderEntity/chopsOrderEntity';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { SurprisePackageOrderEntity } from '../productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderEntity } from '../productOrderEntity/budgetCakeOrderEntity';
import { CustomOrderEntity } from '../productOrderEntity/customProductOrderEntity';
import { CustomPackageOrderEntity } from '../productOrderEntity/customPacakgeOrderEntity';
import { CustomChopsOrderEntity } from '../productOrderEntity/customChopsEntity';
import { CartEntity } from '../productOrderEntity/cartEntity';

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
  ): Promise<CustomOrderEntity | any> {
    console.log('wahala');
    return await this.productService.createCustomProductOrder(
      customProductOrderDto,
      user,
      req,
    );
  }

  @Post('/postCustomPackageOrder')
  @UsePipes(ValidationPipe)
  async customPackageOrder(
    @GetUser() user: AuthEntity,
    @Body() customPackageOrderDto: CustomPackageOrderDto,
  ): Promise<customPackageOrderType> {
    return await this.productService.customPackageOrder(customPackageOrderDto, user);
  }

  @Post('/postCustomChopsOrder')
  @UsePipes(ValidationPipe)
  async customChopsOrder(
    @Body() createChopsOrderDto: CreateChopsOrderDto, 
    @GetUser() user: AuthEntity): Promise<chopsOrderType> {
    return await this.productService.customChopsOrder(createChopsOrderDto, user);
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
    console.log("bronze")
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

  @Get('/getCustomPackageOrder')
  async getCustomPackageOrder(@GetUser() user: AuthEntity): Promise<CustomPackageOrderEntity[]> {
    return await this.productService.getCustomPackageOrder(user);
  }

  @Get('/getCustomChopsOrder')
  async getCustomChopsOrder(
    @GetUser() user: AuthEntity
  ): Promise<CustomChopsOrderEntity[]>{
    return await this.productService.getCustomChopsOrder(user)
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

  @Get('/fetchCartItems')
  async fetchCartItems(
    @GetUser() user: AuthEntity
  ): Promise<CartEntity[]> {
    return await this.productService.fetchCartItems(user)
  }

  @Get('/:id')
  getOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return this.productService.getOrderWithId(id, user);
  }

  @Get('/getCustomPackageWithId/:customPackageId')
  async getCustomPackagewithId(
    @Param('customPackageId') customPackageId: string, 
    @GetUser() user: AuthEntity
    ): Promise<CustomPackageOrderEntity> {
      return await this.productService.getCustomPackageOrderWithId(customPackageId, user);
    }

  @Get('/getChopOrder/:id')
  async getChopOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ChopsOrderEntity> {
    return await this.productService.getChopOrderWithId(id, user);
  }

  @Get('/getCustomChopsOrderWithId/:chopsId')
  async getCustomChopsWithId(
    @Param('chopsId') chopsId: string,
    @GetUser() user: AuthEntity
  ): Promise<CustomChopsOrderEntity> {
    return await this.productService.getCustomChopsOrderWithId(chopsId, user);
  }

  @Patch('/updateCustomPackageOrder/:customPackageId')
  async updateCustomPackageOrder (
    @Param('customPackageId') customPackageId: string, 
    @GetUser() user: AuthEntity, 
    @Body() updateCustomPackageOrderDto: UpdateCustomPackageOrderDto): Promise<CustomPackageOrderEntity> {
    return await this.productService.updateCustomPackageOrder(
      customPackageId,
      user,
      updateCustomPackageOrderDto
    )
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

  @Patch('/updateCustomChopsOrder/:chopsId')
  async updateCustomChops(
    @Body() updateCustomChopsOrder:UpdateCustomChopOrderDto,
    @GetUser() user: AuthEntity,
    @Param('chopsId') chopsId: string,
  ): Promise<CustomChopsOrderEntity> {
    return await this.productService.updateCustomChopsOrder(
      updateCustomChopsOrder,
      user,
      chopsId,
    )
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
