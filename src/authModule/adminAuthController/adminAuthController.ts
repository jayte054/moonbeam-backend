import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminAuthService } from '../adminAuthService/adminAuthService';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';
import { AdminAuthSigninDto } from '../adminAuthDto/adminAuthSigninDto';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { GetUser } from '../getUserDecorator/getUserDecorator';
import { UserDto } from '../authDto/userDto';
import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';
import { AuthGuard } from '@nestjs/passport';

@Controller('adminAuth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('/adminSignup')
  async adminSignup(
    @Body(ValidationPipe) adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    return await this.adminAuthService.adminSignup(adminAuthCredentialsDto);
  }

  @Post('/adminSignin')
  async adminSignin(
    @Body(ValidationPipe) adminAuthSigninDto: AdminAuthSigninDto,
  ): Promise<{ accessToken: string }> {
    return await this.adminAuthService.adminSignin(adminAuthSigninDto);
  }

  @Post('/adminResetPasswordEmail')
  async adminResetEmail(
    @Body() resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return await this.adminAuthService.adminResetPasswordEmail(
      resetPasswordEmailDto,
    );
  }

  @Post('/adminResetPassword')
  async adminResetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return await this.adminAuthService.adminResetPassword(resetPasswordDto);
  }

  @Get('/getAllUsers')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async getAllUsers(
    @GetUser() admin: AdminAuthEntity,
  ): Promise<UserDto[] | ProductOrderEntity[] | any> {
    return await this.adminAuthService.getAllUsers(admin);
  }
}
