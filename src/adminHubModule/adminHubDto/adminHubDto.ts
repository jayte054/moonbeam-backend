import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ProductType } from 'src/products/ProductEnum/productEnum';

export class AdminHubDto {
  @IsString()
  chocolateCakeRate: string;

  @IsString()
  strawberryCakeRate: string;

  @IsString()
  vanillaCakeRate: string;

  @IsString()
  redvelvetCakeRate: string;

  @IsString()
  carrotCakeRate: string;

  @IsString()
  cheeseCakeRate: string;

  @IsString()
  bananaCakeRate: string;

  @IsString()
  appleCakeRate: string;

  @IsString()
  lemonCakeRate: string;

  @IsString()
  coffeeCakeRate: string;

  @IsString()
  coconutCakeRate: string;

  @IsString()
  blueberryCakeRate: string;
}

export class UpdateProductRateDto {
  chocolateCakeRate?: string;

  strawberryCakeRate?: string;

  vanillaCakeRate?: string;

  redvelvetCakeRate?: string;

  carrotCakeRate?: string;

  cheeseCakeRate?: string;

  bananaCakeRate?: string;

  appleCakeRate?: string;

  lemonCakeRate?: string;

  coffeeCakeRate?: string;

  coconutCakeRate?: string;

  blueberryCakeRate?: string;
}

export class UploadProductDto {
  @IsNotEmpty()
  type: ProductType;

  //   file: Express.Multer.File;

  @IsNotEmpty()
  @MaxLength(150)
  description: string;

  @IsDateString()
  date: string;
}

export class UpdateProductDto {
  type?: ProductType;

  file?: Express.Multer.File;

  description?: string;
}
