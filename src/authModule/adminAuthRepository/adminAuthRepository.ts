import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailerModule/mailerService';
import { DataSource, Repository } from 'typeorm';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AdminAuthCredentialsDto } from '../adminAuthDto/AdminAuthDto';
import { AdminAuthSigninDto } from '../adminAuthDto/adminAuthSigninDto';
import { ResetPasswordEmailDto } from 'src/mailerModule/mailerDto/resetpassword.dto';
import { PasswordResetTokenEntity } from '../passwordResetTokenEntity/passwordResetTokenEntity';
import { ResetPasswordDto } from '../authDto/resetPasswordDto';

@Injectable()
export class AdminAuthRepository extends Repository<AdminAuthEntity> {
  private logger = new Logger('AdminAuthRepository');
  constructor(
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {
    super(AdminAuthEntity, dataSource.createEntityManager());
  }

  async adminSignUp(
    adminAuthCredentialsDto: AdminAuthCredentialsDto,
  ): Promise<string> {
    const { firstname, lastname, phoneNumber, email, password } =
      adminAuthCredentialsDto;

    const salt = await bcrypt.genSalt();

    const admin = new AdminAuthEntity();
    admin.firstname = firstname;
    admin.lastname = lastname;
    admin.phoneNumber = phoneNumber;
    admin.email = email;
    admin.salt = salt;
    admin.password = await bcrypt.hash(password, salt);

    try {
      await admin.save();
      this.logger.verbose(`New admin with id of ${admin.id} has been created`);
      await this.mailerService.sendAdminWelcomeMail(admin.email);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        console.log(error);
        this.logger.error('error creating user');
        return 'error creating user';
      }
    }
    return `admin ${JSON.stringify({
      firstname: admin.firstname,
      lastname: admin.lastname,
      phoneNumber: admin.phoneNumber,
      email: admin.email,
      admin: admin.isAdmin,
    })} successfully created`;
  }

  //======= admin signin =======

  async validateAdminPassword(
    adminAuthSigninDto: AdminAuthSigninDto,
  ): Promise<any> {
    const { email, password } = adminAuthSigninDto;
    const queryBuilder = this.createQueryBuilder('admin');
    queryBuilder
      .select([
        'admin.id',
        'admin.email',
        'admin.password',
        'admin.salt',
        'admin.firstname',
        'admin.isAdmin',
        'admin.phoneNumber',
      ])
      .where('admin.email = :email', { email });

    const admin = await queryBuilder.getOne();

    if (admin && (await admin.validatePassword(password))) {
      console.log('admin here', admin);
      return {
        id: admin.id,
        email: admin.email,
        isAdmin: admin.isAdmin,
        firstname: admin.firstname,
        phoneNumber: admin.phoneNumber,
      };
    } else {
      return null;
    }
  }

  //======= admin reset password email ========

  async adminResetPasswordEmail(
    resetPasswordEmailDto: ResetPasswordEmailDto,
  ): Promise<void> {
    return await this.mailerService.sendAdminPasswordResetEmail(
      resetPasswordEmailDto,
    );
  }

  //=======admin reset password ==========

  async adminResetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const resetToken = await PasswordResetTokenEntity.findOne({
        where: { resetToken: token },
      });
      if (!resetToken) {
        this.logger.error('invalid or expired token');
        throw new NotFoundException('Invalid or expired token');
      }
      const admin = await AdminAuthEntity.findOne({
        where: {
          id: resetToken.adminId,
        },
      });

      const isTokenExpired = resetToken.expiresAt > new Date();
      if (!isTokenExpired) {
        this.logger.error('token has expired');
        throw new UnauthorizedException('token has expired');
      }

      admin.salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, admin.salt);
      admin.password = hash;
      admin.save();
      resetToken.remove();
      this.logger.verbose('password reset successful');
      await this.mailerService.resetPasswordSuccessMail(admin.email);
      return 'password reset successful';
    } catch (error) {
      this.logger.error('admin password reset unsuccessful');
      return 'password reset unsuccessful';
    }
  }
}
