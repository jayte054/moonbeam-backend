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