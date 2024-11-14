import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { AuthCredentialsDto } from '../authDto/authCredentialsDto';
import { AuthSigninDto } from '../authDto/authSigninDto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';
import { AuthService } from '../authService/authService';
import { GetUser } from '../getUserDecorator/getUserDecorator';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AuthEntity } from '../authEntity/authEntity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    console.log('hello');
    return await this.authService.signup(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) authSigninDto: AuthSigninDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signin(authSigninDto);
  }

  @Post('/resetEmail')
  async sendPasswordResetEmail(
    @Body() resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return await this.authService.resetPasswordEmail(resetPasswordEmailDto);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string | any> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('/getAll')
  async getAll() {
    return await this.authService.getAll();
  }
}
