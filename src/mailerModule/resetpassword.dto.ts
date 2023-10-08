import { IsNotEmpty } from 'class-validator';

export class ResetPasswordEmailDto {
  @IsNotEmpty()
  email: string;
}
