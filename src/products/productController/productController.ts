// import {
//   Controller,
//   Post,
//   UseGuards,
//   ValidationPipe,
//   Request,
//   ParseFilePipe,
//   MaxFileSizeValidator,
//   FileTypeValidator,
// } from '@nestjs/common';
// import {
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   UsePipes,
// } from '@nestjs/common/decorators';
// import { AuthGuard } from '@nestjs/passport';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// // import { Request } from 'express';
// import { AuthEntity } from 'src/authModule/authEntity/authEntity';
// import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
// import { ProductOrderDto } from '../productDto/productOrderDto';
// import { ProductOrderEntity } from '../productEntity/productOrderEntity';
// import { ProductService } from '../productService/productService';

// @Controller('products')
// @UseGuards(AuthGuard())
// export class ProductController {
//   constructor(private productService: ProductService) {}

//   @Post('/postOrder')
//   @UseInterceptors(FileInterceptor('file'))
//   @UsePipes(ValidationPipe)
//   async postOrder(
//     @UploadedFile(
//       new ParseFilePipe({
//         validators: [
//           new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
//           new FileTypeValidator({ fileType: '.(png|jpeg|jpg' }),
//         ],
//       }),
//     )
//     file: Express.Multer.File,
//     @Body() productOrderDto: ProductOrderDto,
//     @GetUser() user: AuthEntity,
//     @Request() req: Request | any,
//   ): Promise<ProductOrderEntity | any> {
//     console.log('here');
//     return await this.productService.createProductOrder(
//       productOrderDto,
//       user,
//       req,
//     );
//   }
// }

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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import { ProductOrderDto } from '../productDto/productOrderDto';
import { ProductService } from '../productService/productService';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { diskStorage } from 'multer';
import { ProductLayers, ProductType } from '../ProductEnum/productEnum';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/postOrder')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async postOrder(
    @Body() productOrderDto: ProductOrderDto,
    @GetUser() user: AuthEntity,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Request | any,
  ): Promise<ProductOrderEntity | any> {
    console.log('wahala');
    return await this.productService.createProductOrder(
      productOrderDto,
      user,
      req,
    );
  }

  @Get('/getOrders')
  async getOrders(): Promise<ProductOrderEntity> {
    return await this.productService.getOrders();
  }

  @Get('/:id')
  getOrderWithId(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<ProductOrderEntity> {
    return this.productService.getOrderWithId(id, user);
  }
  // user: AuthEntity,
  // type?: ProductType,
  // layers?: ProductLayers,
  // deliveryDate?: string,
  // imageUrl?: string,
  // req?: Request,
  @Patch('/:id/update')
  async updateOrder(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
    @Body('type') type: ProductType,
    @Body('layers') layers: ProductLayers,
    @Body('deliveryDate') deliveryDate: string,
    // @Body('imageUrl') imageUrl: string,
    // @Request() req: Request | any,
  ): Promise<ProductOrderEntity> {
    return await this.productService.updateOrder(
      id,
      user,
      type,
      layers,
      deliveryDate,
      // imageUrl,
      // req,
    );
  }
}
