import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  additionalPhoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsBoolean()
  @IsNotEmpty()
  defaultAddress: boolean;
}

export class UpdateAddressDto {
  firstName?: string; 
  lastName?: string;
  phoneNumber?: string;
  additionalPhoneNumber?: string;
  deliveryAddress?: string;
  region?: string;
  city?: string;
  defaultAddress?: boolean;
}

export class DefaultAddressDto {
    @IsString()
  @IsNotEmpty()
  studioTitle: string;

    @IsString()
  @IsNotEmpty()
  studioAddress: string;

    @IsString()
  @IsNotEmpty()
  LGA: string;

    @IsString()
  @IsNotEmpty()
  state: string;

    @IsString()
  @IsNotEmpty()
  phoneNumber: string;

    @IsString()
  @IsNotEmpty()
  deliveryBaseFee: string;

    @IsString()
  @IsNotEmpty()
  deliveryPricePerKm: string;

    @IsString()
  @IsNotEmpty()
  defaultStudioAddress: boolean;

    @IsString()
  @IsNotEmpty()
  userId: string;
}