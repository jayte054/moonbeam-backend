import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AdminAuthCredentialsDto {
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  firstname: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  lastname: string;

  @IsString()
  @MinLength(11)
  @MaxLength(11)
  phoneNumber: string;

  @IsString()
  @MinLength(10)
  @MaxLength(30)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
