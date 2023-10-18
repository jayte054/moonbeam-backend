import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAuthRepository } from '../adminAuthRepository/adminAuthRepository';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';
import { AdminAuthSigninDto } from '../adminAuthDto/adminAuthSigninDto';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';

@Injectable()
export class AdminAuthService {
  private logger = new Logger('AdminAuthService');
  constructor(
    @InjectRepository(AdminAuthRepository)
    private adminAuthRepository: AdminAuthRepository,
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

    const { id, email } = adminDetails;

    try {
      if (!adminDetails) {
        throw new UnauthorizedException('invalid credentials');
      }

      const payload: JwtPayload = { id, email };

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
}
