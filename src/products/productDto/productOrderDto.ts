import { IsDateString, IsNotEmpty, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
// import { UploadedFile } from '@nestjs/platform-express';

export class ProductOrderDto {
  @IsNotEmpty()
  @MinLength(6)
  orderName: string;

  @IsDateString()
  deliveryDate: string;

  // @UploadedFile()
  // imageUrl: string;

  // @Type(() => UploadedFile)
  file: Express.Multer.File;
}
