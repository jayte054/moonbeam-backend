import { IsString } from 'class-validator';

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
