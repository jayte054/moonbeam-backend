import { IsNotEmpty, IsString } from "class-validator";

export class PaymentDto {

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

}