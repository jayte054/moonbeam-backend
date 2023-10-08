import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthSigninDto {
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
