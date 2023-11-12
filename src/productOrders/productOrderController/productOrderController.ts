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
} from '../productOrderDto/productOrderDto';
import { ProductService } from '../productOrderService/productOrderService';
import { ProductOrderEntity } from '../productOrderEntity/productOrderEntity';

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

  @Post('/postGenericOrder')
  @UsePipes(ValidationPipe)
  async genericProductOrder(
    @Body() genericProductOrderDto: GenericProductOrderDto,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity | any> {
    console.log('wahala');
    return await this.productService.genericProductOrder(
      genericProductOrderDto,
      user,
    );
  }

  @Get('/getOrders')
  async getOrders(@GetUser() user: AuthEntity): Promise<ProductOrderEntity[]> {
    return await this.productService.getOrders(user);
  }

  @Get('/:id')
  getOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return this.productService.getOrderWithId(id, user);
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
