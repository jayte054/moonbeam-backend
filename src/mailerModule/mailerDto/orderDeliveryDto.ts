import { IsNotEmpty, MaxLength } from 'class-validator';

export class OrderDeliveryDto {
  @IsNotEmpty()
  @MaxLength(6)
  email: string;
}
