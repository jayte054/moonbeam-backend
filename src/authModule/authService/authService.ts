import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AuthCredentialsDto } from '../authDto/authCredentialsDto';
import { AuthSigninDto } from '../authDto/authSigninDto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';
import { AuthEntity } from '../authEntity/authEntity';
import { AuthRepository } from '../authRepository/authRepository';
import { JwtPayload } from '../jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  //====signup=====//

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authRepository.signUp(authCredentialsDto);
  }

  //====signin====//

  async signin(authSigninDto: AuthSigninDto): Promise<{ accessToken: string }> {
    const userDetails = await this.authRepository.validateUserPassword(
      authSigninDto,
    );

    try {
      const { id, email, firstname, lastname, phoneNumber } = userDetails;

      if (!userDetails) {
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
        user: userDetails,
      };
      return response;
    } catch (error) {
      throw new Error('incorrect user details');
    }
  }

  //reset password email//

  async resetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return await this.authRepository.resetPasswordEmail(resetPasswordEmailDto);
  }

  //======reset password =======//
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<string | any> {
    return this.authRepository.resetPassword(resetPasswordDto);
  }

  //=========get all users =======//

  async getAllUsers(admin: AdminAuthEntity): Promise<AuthEntity[]> {
    return await this.authRepository.getAllUsers(admin);
  }

  async getAll(): Promise<AuthEntity[]> {
    return await this.authRepository.getAll();
  }
}
