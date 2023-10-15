import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../authDto/authCredentialsDto';
import { AuthEntity } from '../authEntity/authEntity';
import { AuthSigninDto } from '../authDto/authSigninDto';
import { MailerService } from 'src/mailerModule/mailerService';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';
import { PasswordResetTokenEntity } from '../passwordResetTokenEntity/passwordResetTokenEntity';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  private logger = new Logger('AuthRepository');
  constructor(
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {
    super(AuthEntity, dataSource.createEntityManager());
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { firstname, lastname, phoneNumber, email, password } =
      authCredentialsDto;

    const salt = await bcrypt.genSalt();

    const user = new AuthEntity();
    user.firstname = firstname;
    user.lastname = lastname;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.salt = salt;
    user.password = await bcrypt.hash(password, user.salt);

    try {
      console.log('done');
      await user.save();
      this.logger.verbose('New user created');
      await this.mailerService.sendWelcomeMail(user.email);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        console.log(error);
        this.logger.error('error creating user');
        // throw new InternalServerErrorException();
        return 'error creating user';
      }
    }
    return `user ${JSON.stringify({
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      admin: user.isAdmin,
      email: user.email,
    })} created successfully`;
  }

  //====== user sign in ========

  async validateUserPassword(authSigninDto: AuthSigninDto): Promise<any> {
    const { email, password } = authSigninDto;
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder
      .select(['user.id', 'user.email', 'user.password', 'user.salt'])
      .where('user.email = :email', { email });

    const user = await queryBuilder.getOne();

    if (user && (await user.validatePassword(password))) {
      return { id: user.id, email: user.email, isAdmin: user.isAdmin };
    } else {
      return null;
    }
  }

  //========reset password email ========//

  async resetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return await this.mailerService.sendPasswordResetEmail(
      resetPasswordEmailDto,
    );
  }

  //========= reset password ========//
  async resetPassword(
    resetpasswordDto: ResetPasswordDto,
  ): Promise<string | any> {
    const { token, newPassword } = resetpasswordDto;
    try {
      const resetToken = await PasswordResetTokenEntity.findOne({
        where: { resetToken: token },
      });
      if (!resetToken) {
        this.logger.error('invalid or expired token');
        throw new NotFoundException('Invalid or expired token');
      }

      const user = await AuthEntity.findOne({
        where: {
          id: resetToken.userId,
        },
      });

      const isTokenExpired = resetToken.expiresAt > new Date();
      if (!isTokenExpired) {
        this.logger.error('token has expired');
        throw new UnauthorizedException('token has expired');
      }

      user.salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, user.salt);
      user.password = hash;
      user.save();
      resetToken.remove();
      this.logger.verbose('password reset successful');
      return 'password reset successful';
    } catch (error) {
      console.log(error);
      this.logger.error('password reset failure');
      return 'password reset unsuccessful';
    }
  }
}
