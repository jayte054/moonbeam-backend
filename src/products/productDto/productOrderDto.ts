import { IsDateString, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProductInch,
  ProductLayers,
  ProductType,
} from '../ProductEnum/productEnum';
// import { UploadedFile } from '@nestjs/platform-express';

export class CustomProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  file: Express.Multer.File;
}

export class GenericProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  imageUrl: string;
}

export class UpdateOrderDto {
  type?: ProductType;

  layers?: ProductLayers;

  inches?: ProductInch;

  deliveryDate?: string;

  file?: Express.Multer.File;
}
