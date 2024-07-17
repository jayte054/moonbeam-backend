import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAuthRepository } from '../adminAuthRepository/adminAuthRepository';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';
import { AdminAuthSigninDto } from '../adminAuthDto/adminAuthSigninDto';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';
import { AuthRepository } from '../authRepository/authRepository';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';

@Injectable()
export class AdminAuthService {
  private logger = new Logger('AdminAuthService');
  constructor(
    @InjectRepository(AdminAuthRepository)
    @InjectRepository(AuthRepository)
    private adminAuthRepository: AdminAuthRepository,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  //========= admin signup ==========

  async adminSignup(
    adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    return await this.adminAuthRepository.adminSignUp(adminAuthCredentialsDto);
  }

  async adminSignin(
    adminAuthSigninDto: AdminAuthSigninDto,
  ): Promise<{ accessToken: string }> {
    const adminDetails = await this.adminAuthRepository.validateAdminPassword(
      adminAuthSigninDto,
    );


    try {
      const { id, email, firstname, lastname, phoneNumber } = adminDetails;
      if (!adminDetails) {
        throw new UnauthorizedException('invalid credentials');
      }

      const payload: JwtPayload = {
        id,
        email,
        firstname,
        lastname,
        phoneNumber,
      };

      const accessToken = await this.jwtService.sign(payload);
      this.logger.verbose(
        `JWT token generated with payload: ${JSON.stringify(payload)}`,
      );
      const response = {
        accessToken: accessToken,
        admin: adminDetails,
      };

      return response;
    } catch (error) {
      throw new Error('incorrect admin Details');
    }
  }

  async adminResetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return this.adminAuthRepository.adminResetPasswordEmail(
      resetPasswordEmailDto,
    );
  }

  async adminResetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return await this.adminAuthRepository.adminResetPassword(resetPasswordDto);
  }

  async getAllUsers(admin: AdminAuthEntity): Promise<any> {
    return await this.authRepository.getAllUsers(admin);
  }
}
