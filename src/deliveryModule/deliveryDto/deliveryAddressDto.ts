import { IsNotEmpty, IsString } from "class-validator";

export class DeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: number;

  additionalPhoneNumber?: number;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  defaultAddress: boolean;
}

export class UpdateAddressDto {
  firstName?: string; 
  lastName?: string;
  phoneNumber?: number;
  additionalPhoneNumber?: number;
  deliveryAddress?: string;
  region?: string;
  city?: string;
  defaultAddress?: boolean;
}