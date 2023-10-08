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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { GetUser } from 'src/authModule/getUserDecorator/getUserDecorator';
import { ProductOrderDto } from '../productDto/productOrderDto';
import { ProductService } from '../productService/productService';
import { ProductOrderEntity } from '../productEntity/productOrderEntity';
import { diskStorage } from 'multer';

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
    // productOrderDto.file = file;
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
}
