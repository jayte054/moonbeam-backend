import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  file: Express.Multer.File;
}

export class UpdateProfileDto {
  firstname?: string;

  lastname?: string;

  phoneNumber?: string;

  address?: string;

  dateOfBirth?: string;

  file?: Express.Multer.File;
}
