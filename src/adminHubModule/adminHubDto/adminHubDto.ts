import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ProductType } from 'src/productOrders/ProductOrderEnum/productOrderEnum';
import { Covering } from 'src/productOrders/ProductOrderEnum/productOrderEnum';

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

  @IsString()
  samosaRate?: string;

  @IsString()
  springRollRate?: string;

  @IsString()
  samosa_springrollRate?: string;

  @IsString()
  puffRate?: string;

  @IsString()
  pepperedMeatRate?: string;

  @IsString()
  puff_pepperedMeatRate?: string;

  @IsString()
  samosa_pepperedMeatRate?: string;

  @IsString()
  springroll_pepperedMeatRate?: string;

  @IsString()
  meatPieRate?: string;

  @IsString()
  donutsRate?: string;

  @IsString()
  cinamonRollsRate?: string;

  @IsString()
  pancakesRate?: string;

  @IsString()
  corndogsRate?: string;

  @IsString()
  waffelsRate?: string;

  @IsString()
  meatpie_donutsRate?: string;

  @IsString()
  pancakes_corndogs_waffelsRate?: string;

  @IsString()
  foilCakeRate: string;

  @IsString()
  cakeParfaitRate: string;
}

export class AdminBudgetHubDto {
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

  @IsString()
  foilCakeRate: string;

  @IsString()
  cakeParfaitRate: string;
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

  samosaRate?: string;

  springRollRate?: string;

  samosa_springrollRate?: string;

  puffRate?: string;

  pepperedMeatRate?: string;

  puff_pepperedMeatRate?: string;

  samosa_pepperedMeatRate?: string;

  springroll_pepperedMeatRate?: string;

  meatPieRate?: string;

  donutsRate?: string;

  cinamonRollsRate?: string;

  pancakesRate?: string;

  corndogsRate?: string;

  waffelsRate?: string;

  meatpie_donutsRate?: string;

  pancakes_corndogs_waffelsRate?: string;

  foilCakeRate: string;

  cakeParfaitRate: string;
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

export class ProductDesignRateDto {
  nakedRate?: string;

  butterCreamRate?: string;

  fundantRate?: string;

  covering?: Covering;
}

export class UpdateDesignRateDto {
  nakedRate?: string;

  butterCreamRate?: string;

  fundantRate?: string;

  covering?: Covering;
}

export class SurprisePackageDto {
  @IsNotEmpty()
  packageName: string;

  @IsNotEmpty()
  itemOne: string;

  @IsNotEmpty()
  itemTwo: string;

  @IsNotEmpty()
  itemThree: string;

  @IsNotEmpty()
  itemFour: string;

  @IsNotEmpty()
  itemFive: string;

  @IsNotEmpty()
  itemSix: string;

  itemSeven?: string;

  itemEight?: string;

  itemNine?: string;

  itemTen?: string;

  itemEleven?: string;

  itemTwelve?: string;

  imageUrl: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateSurprisePackageDto {
  packageName?: string;

  itemOne?: string;

  itemTwo?: string;

  itemThree?: string;

  itemFour?: string;

  itemFive?: string;

  itemSix?: string;

  itemSeven?: string;

  itemEight?: string;

  itemNine?: string;

  itemTen?: string;

  itemEleven?: string;

  itemTwelve?: string;

  file?: Express.Multer.File;

  price?: string;

  description?: string;
}
