import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { PasswordResetTokenEntity } from 'src/authModule/passwordResetTokenEntity/passwordResetTokenEntity';
import { ResetPasswordEmailDto } from './resetpassword.dto';
import { Gmail_Password, Gmail_User } from '../cloudinaryConfig';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';

@Injectable()
export class MailerService {
  private logger = new Logger('mailerService');
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: Gmail_User,
        pass: Gmail_Password,
      },
    });
  }

  //======signup welcome mail====//

  async sendWelcomeMail(email: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes',
      html: ` 
          Dear ${email}, welcome to moonbeamcakes! We look forward to a delightful experience with you`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} welcome mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException();
    }
  }

  //======= send reset token to email =======//

  async sendPasswordResetEmail(
    resetPasswordEmaildto: ResetPasswordEmailDto,
  ): Promise<PasswordResetTokenEntity | any> {
    const { email } = resetPasswordEmaildto;

    const generateResetToken = () => {
      //   const token = crypto.randomBytes(15).toString('hex');
      const generateNumericToken = () => {
        const randomBytes = crypto.randomBytes(3);
        const numericCode = parseInt(randomBytes.toString('hex'), 16);
        const code = String(numericCode).slice(-6).padStart(6, '0');
        return code;
      };
      const token = generateNumericToken();
      const expiresInMinutes = 10;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
      console.log(expiresAt);
      return token;
    };

    const generateResetLink = (resetToken: string): string => {
      const resetLink = `localhost:3005/reset-password?token=${resetToken}`;
      return resetLink;
    };

    const resetToken = generateResetToken();
    const resetLink = generateResetLink(resetToken);

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Password Reset Token',
      html: `
        <h1>Password Reset Email</h1>
        <p> My dear customer, you have requested a password reset,</br>
            please use this reset token as prompted <br/> <strong>${resetToken}</strong>
        </p>
        <p> Please bear in mind that this token expires in 10mins</p>
        `,
    };

    const getTimeStampPlusMinutes = (minutes: number) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    };

    const user = await AuthEntity.findOne({ where: { email } });
    const passwordResetToken = new PasswordResetTokenEntity();
    passwordResetToken.id = uuidV4();
    passwordResetToken.resetToken = resetToken;
    passwordResetToken.expiresAt = getTimeStampPlusMinutes(20);
    passwordResetToken.email = email;
    passwordResetToken.user = user;

    try {
      await passwordResetToken.save();
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error);
      throw new Error('failed to send password reset token');
    }

    console.log(passwordResetToken.expiresAt);

    return {
      id: passwordResetToken.id,
      resetToken: passwordResetToken.resetToken,
      email: passwordResetToken.email,
      expiresAt: passwordResetToken.expiresAt,
      message: 'reset token sent successfully',
    };
  }
}
