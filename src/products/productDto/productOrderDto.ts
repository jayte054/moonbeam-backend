import { IsDateString, IsNotEmpty, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductLayers, ProductType } from '../ProductEnum/productEnum';
// import { UploadedFile } from '@nestjs/platform-express';

export class ProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  // @UploadedFile()
  // imageUrl: string;

  // @Type(() => UploadedFile)
  file: Express.Multer.File;
}

export class UpdateOrderDto {
  type?: ProductType;

  layers?: ProductLayers;

  deliveryDate?: string;

  file?: Express.Multer.File;
}
