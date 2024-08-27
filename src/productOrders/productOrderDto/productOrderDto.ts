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
  ChopPackageType,
  NumberOfPacks,
  ChopProductType,
  PastryPackageType,
  Covering,
} from '../ProductOrderEnum/productOrderEnum';
import {
  bronzePackageObject,
  diamondPackageObject,
  goldPackageObject,
  silverPackageObject,
} from 'src/types';
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

  type: ProductType;
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

  type: ProductType;
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

export class GenericChopsOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderTitle: string;

  @IsDateString()
  deliveryDate: string;

  file?: Express.Multer.File;

  @IsNotEmpty()
  @MaxLength(80)
  description: string;

  type: ChopProductType; //change to ChopProductType to cover pastry options and chops option

  chopPackageType?: ChopPackageType;

  customChopPackage?: string;

  numberOfPacks?: NumberOfPacks;

  customNumberOfPacks?: string;

  pastryPackageType?: PastryPackageType;

  customPastryPackage?: string;

  covering?: Covering;
}

export class UpdateGenericChopsOrderDto {
  orderTitle?: string;

  deliveryDate?: string;

  file?: Express.Multer.File;

  description?: string;

  type: ChopProductType; //change to ChopProductType to cover pastry options and chops option

  chopPackageType?: ChopPackageType;

  customChopPackage?: string;

  numberOfPacks?: NumberOfPacks;

  customNumberOfPacks?: string;

  pastryPackageType?: PastryPackageType;

  customPastryPackage?: string;

  covering?: Covering;
}

export class bronzePackageDto {
  packageName: string;

  itemOne: string;

  itemTwo: string;

  itemThree: string;

  itemFour: string;

  itemFive: string;

  itemSix: string;

  price: string;

  description: string;
}

export class silverPackageDto {
  packageName: string;

  itemOne: string;

  itemTwo: string;

  itemThree: string;

  itemFour: string;

  itemFive: string;

  itemSix: string;

  itemSeven: string;

  itemEight: string;

  price: string;

  description: string;
}

export class goldPackageDto {
  packageName: string;

  itemOne: string;

  itemTwo: string;

  itemThree: string;

  itemFour: string;

  itemFive: string;

  itemSix: string;

  itemSeven: string;

  itemEight: string;

  itemNine: string;

  itemTen: string;

  price: string;

  description: string;
}

export class diamondPackageDto {
  packageName: string;

  itemOne: string;

  itemTwo: string;

  itemThree: string;

  itemFour: string;

  itemFive: string;

  itemSix: string;

  itemSeven: string;

  itemEight: string;

  itemNine: string;

  itemTen: string;

  itemEleven: string;

  itemTwelve: string;

  price: string;

  description: string;
}

export class SurprisePackageOrderDto {
  @IsNotEmpty()
  packageOrderName: string;

  addInfo: string;

  deliveryDate: string;
}

export class UpdateSurprisePackageOrderDto {
  packageOrderName?: string;

  addInfo?: string;

  deliveryDate?: string;
}

export class CustomPackageOrderDto {
  @IsNotEmpty()
  @IsString()
  orderName: string;

  @IsNotEmpty()
  @IsString()
  item: string;

  @IsNotEmpty()
  @IsString()
  deliveryDate: string;

  @IsNotEmpty()
  @IsString()
  addInfo: string;

  @IsString()
  status: OrderStatus;
}

export class UpdateCustomPackageOrderDto {
  orderName?: string;
  item?: string;
  deliveryDate?: string;
  addInfo?: string;
  status?: OrderStatus;
}

export class CreateChopsOrderDto {
  @IsString()
  @IsNotEmpty()
  orderName: string;

  @IsString()
  @IsNotEmpty()
  chopType: string;

  @IsString()
  @IsNotEmpty()
  numberOfPacks: string;

  @IsString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateCustomChopOrderDto {
  orderName?: string;
  chopType?: string;
  numberOfPacks?: string;
  deliveryDate?: string;
  description?: string;
  status: OrderStatus;
}

export class CartDto {
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  itemType: string;

  quantity?: string;

  @IsString()
  @IsNotEmpty()
  productOrderId: string;
}