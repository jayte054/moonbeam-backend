import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  DesignCovering,
  OrderStatus,
  ProductFlavours,
  ProductInch,
  ProductLayers,
  ProductType,
} from '../ProductOrderEnum/productOrderEnum';
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

  productFlavour: ProductFlavours;

  designCovering: DesignCovering;

  layers: ProductLayers;

  inches: ProductInch;
}

export class GenericProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  file: Express.Multer.File;

  @IsNotEmpty()
  @MaxLength(80)
  description: string;

  productFlavour: ProductFlavours;

  designCovering: DesignCovering;

  layers: ProductLayers;

  inches: ProductInch;
}

export class UpdateOrderDto {
  orderName?: string;

  type?: ProductType;

  layers?: ProductLayers;

  inches?: ProductInch;

  rate?: string;

  productFlavour: ProductFlavours;

  designCovering: DesignCovering;

  deliveryDate?: string;

  file?: Express.Multer.File;

  description?: string;

  status?: OrderStatus;

  token?: string;
}
