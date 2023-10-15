import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { PasswordResetTokenEntity } from 'src/authModule/passwordResetTokenEntity/passwordResetTokenEntity';
import { ResetPasswordEmailDto } from './mailerDto/resetpassword.dto';
import { Gmail_Password, Gmail_User } from '../cloudinaryConfig';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { ProductOrderEntity } from 'src/products/productEntity/productOrderEntity';
import { OrderDeliveryDto } from './mailerDto/orderDeliveryDto';
import { DeliveryTokenEntity } from 'src/products/deliveryTokenEntity/deliveryTokenEntity';

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
      this.logger.verbose(
        `${resetToken} for user ${user.id} sent successfully`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`reset token for user ${user.id} not sent`);
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

  async productOrderMail(
    email: string,
    order: ProductOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const status = order.status;
    const description = order.deliveryDate;
    const deliveryDate = order.deliveryDate;
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Inches: ${inches}</p>
             <p> Layers: ${layers}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully made.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException();
    }
  }

  async updateOrderMail(
    email: string,
    order: ProductOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Updated Order',
      html: ` 
            Dear ${email}, this is to notify you that the update to your order </br>
             <p> Order Name: ${name}</p>
             <p> Inches: ${inches}</p>
             <p> Layers: ${layers}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p> 
             has been successful`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} order update mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException();
    }
  }

  async cancelOrderMail(
    email: string,
    order: ProductOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const description = order.description;
    const status = order.status;
    const deliveryDate = order.deliveryDate;
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moobeamcakes order canceled',
      html: ` 
      Dear ${email}, this is to notify you that the update to your order </br>
       <p> Order Name: ${name}</p>
       <p> Inches: ${inches}</p>
       <p> Layers: ${layers}</p>
       <p> Price: ${price}</p>
       <p> Status: ${status}</p>
       <p> Description: ${description}</p>
       <p> DeliveryDate: ${deliveryDate} </p> 
       has been canceled`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `cancel order mail from email ${email} has been sent successfully`,
      );
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException();
    }
  }

  async sendDeliveryToken(
    orderDeliveryDto: OrderDeliveryDto,
  ): Promise<DeliveryTokenEntity | any> {
    const { email } = orderDeliveryDto;

    const generateDeliveryToken = () => {
      const generateNumbericToken = () => {
        const randomBytes = crypto.randomBytes(3);
        const numericCode = parseInt(randomBytes.toString('hex'), 16);
        const code = String(numericCode).slice(-6).padStart(6, '0');
        return code;
      };
      const token = generateNumbericToken();
      const expiresInMinutes = 1440;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
      return token;
    };

    const deliveryToken = generateDeliveryToken();

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: ' Order Delivery Token',
      html: `
        <h1>Delivery Token</h1>
        <p> My dear customer, please use this delivery toke <strong>${deliveryToken}</strong>,<br/> 
            to authenticate delivery; 
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
    const orderDeliveryToken = new DeliveryTokenEntity();
    orderDeliveryToken.id = uuidV4();
    orderDeliveryToken.deliveryToken = deliveryToken;
    orderDeliveryToken.expiresAt = getTimeStampPlusMinutes(1440);
    orderDeliveryToken.email = email;
    orderDeliveryToken.user = user;

    try {
      await orderDeliveryToken.save();
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `delivery token for with email ${email} has been sent successfully`,
      );
    } catch (error) {
      this.logger.error(`delivery token for email ${email} not sent`);
      throw new Error(`failed to send delivery token`);
    }

    return {
      id: orderDeliveryToken.id,
      deliveryToken: orderDeliveryToken.deliveryToken,
      email: orderDeliveryToken.email,
      expiresAt: orderDeliveryToken.expiresAt,
      message: 'delivery token sent successfully',
    };
  }

  async orderDeliveryMail(
    email: string,
    order: ProductOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const description = order.description;
    const status = order.status;
    const deliveryDate = order.deliveryDate;
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      html: ` 
      Dear ${email}, this is to notify you that your order </br>
       <p> Order Name: ${name}</p>
       <p> Inches: ${inches}</p>
       <p> Layers: ${layers}</p>
       <p> Price: ${price}</p>
       <p> Status: ${status}</p>
       <p> Description: ${description}</p>
       <p> DeliveryDate: ${deliveryDate} </p> 
       has been successfully delivered`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `cancel order mail from email ${email} has been sent successfully`,
      );
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException();
    }
  }
}
