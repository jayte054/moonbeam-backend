import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  OrderStatus,
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

  @IsNotEmpty()
  @MaxLength(80)
  description: string;
}

export class GenericProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @MaxLength(80)
  description: string;
}

export class UpdateOrderDto {
  orderName?: string;

  type?: ProductType;

  layers?: ProductLayers;

  inches?: ProductInch;

  deliveryDate?: string;

  file?: Express.Multer.File;

  description?: string;

  status?: OrderStatus;

  token?: string;
}
