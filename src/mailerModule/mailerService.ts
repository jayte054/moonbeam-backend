import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { v4 as uuidV4 } from 'uuid';
import { PasswordResetTokenEntity } from 'src/authModule/passwordResetTokenEntity/passwordResetTokenEntity';
import { ResetPasswordEmailDto } from './mailerDto/resetpassword.dto';
import { Gmail_Password, Gmail_User } from '../cloudinaryConfig';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from 'src/productOrders/productOrderEntity/chopsOrderEntity';
import { OrderDeliveryDto } from './mailerDto/orderDeliveryDto';
import { DeliveryTokenEntity } from 'src/productOrders/deliveryTokenEntity/deliveryTokenEntity';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { SurprisePackageOrderEntity } from 'src/productOrders/productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderEntity } from 'src/productOrders/productOrderEntity/budgetCakeOrderEntity';
import { CustomOrderEntity } from 'src/productOrders/productOrderEntity/customProductOrderEntity';
import { CustomPackageOrderEntity } from 'src/productOrders/productOrderEntity/customPacakgeOrderEntity';
import { CustomChopsOrderEntity } from 'src/productOrders/productOrderEntity/customChopsEntity';
import { CakeVariantEntity } from 'src/productOrders/productOrderEntity/cakeVariantEntity';
import { CartEntity } from 'src/productOrders/productOrderEntity/cartEntity';
import { RtgOrderEntity } from 'src/productOrders/rtgOrderEntity/rtgOrderEntity';

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
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async sendAdminWelcomeMail(email: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes',
      html: ` 
          Dear ${email}, welcome to moonbeamcakes! We look forward to a delightful experience with you`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`Admin ${email} welcome mail sent successfully`);
    } catch (error) {
      this.logger.error(`Admin ${email} invalid email address`);
      throw new InternalServerErrorException(
        `admin with email ${email} invalid`,
      );
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
        `reset password token ${resetToken} for user ${user.id} sent successfully`,
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

  async sendAdminPasswordResetEmail(
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

    const admin = await AdminAuthEntity.findOne({ where: { email } });
    const passwordResetToken = new PasswordResetTokenEntity();
    passwordResetToken.id = uuidV4();
    passwordResetToken.resetToken = resetToken;
    passwordResetToken.expiresAt = getTimeStampPlusMinutes(20);
    passwordResetToken.email = email;
    passwordResetToken.admin = admin;

    try {
      await passwordResetToken.save();
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `reset password token ${resetToken} for admin ${admin.id} sent successfully`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`reset token for admin ${admin.id} not sent`);
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

  async resetPasswordSuccessMail(email: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      html: `
        <h1> Password Reset </h1>
        <p> Dear ${email}, you have successfully reset your password
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`password reset success mail sent`);
    } catch {
      this.logger.error('invalid email address');
    }
  }

  async productOrderMail(
    email: string,
    order: ProductOrderEntity,
  ): Promise<any> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

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
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async rtgOrderMail(email: string, order: RtgOrderEntity): Promise<any> {
    const name = order.orderName;
    const type = order.orderType;
    const price = order.price;
    const status = order.status;
    const message = order.cakeMessage;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Inches: ${type}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${message}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async defaultMail(email: string, cartItem: CartEntity): Promise<any> {
    const name = cartItem.itemName;
    const quantity = cartItem.quantity;
    const price = cartItem.price;
    const status = 'delivery in progress';
    const deliveryDate = cartItem.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
           <p> Order Name: ${name}</p>
             <p> Inches: ${quantity}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.

          Please feel free to live a review by clicking on the link 
          <p><a href="localhost:3000/reviewPage"> Review  Page </a></p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async foilCakeOrderMail(
    email: string,
    foilCakeOrder: CakeVariantEntity,
  ): Promise<void> {
    const name = foilCakeOrder.orderName;
    const quantity = foilCakeOrder.quantity;
    const price = foilCakeOrder.price;
    const status = foilCakeOrder.status;
    const description = foilCakeOrder.description;
    const deliveryDate = foilCakeOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Inches: ${quantity}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `User ${email} foilCake order mail sent successfully`,
      );
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async cakeParfaitOrderMail(
    email: string,
    foilCakeOrder: CakeVariantEntity,
  ): Promise<void> {
    const name = foilCakeOrder.orderName;
    const quantity = foilCakeOrder.quantity;
    const price = foilCakeOrder.price;
    const status = foilCakeOrder.status;
    const description = foilCakeOrder.description;
    const deliveryDate = foilCakeOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Inches: ${quantity}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `User ${email} foilCake order mail sent successfully`,
      );
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async customChopsOrderMail(
    email: string,
    order: CustomChopsOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const chopType = order.chopType;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Chop: ${chopType}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async customOrderMail(
    email: string,
    order: CustomOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Inches: ${inches}</p>
             <p> Layers: ${layers}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async updateCustomPackageOrder(
    email: string,
    order: CustomPackageOrderEntity,
  ) {
    const name = order.orderName;
    const item = order.item;
    const price = order.price;
    const status = order.status;
    const description = order.addInfo;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${item}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(
        `User ${email} custom order request mail sent successfully`,
      );
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async budgetCakeOrderMail(
    email: string,
    order: BudgetCakeOrderEntity,
  ): Promise<void> {
    const name = order.orderName;
    const inches = order.inches;
    const layers = order.layers;
    const price = order.price;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

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
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async chopsOrderMail(email: string, order: ChopsOrderEntity): Promise<any> {
    const name = order.orderTitle;
    const packageType = order.chopPackageType || order.customChopPackage;
    const packs = order.numberOfPacks || order.customNumberOfPacks;
    const price = order.price;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Packs: ${packs}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async updateChopsOrderMail(
    email: string,
    order: ChopsOrderEntity,
  ): Promise<void> {
    const name = order.orderTitle;
    const packageType = order.chopPackageType || order.customChopPackage;
    const packs = order.numberOfPacks || order.customNumberOfPacks;
    const price = order.price;
    const status = order.status;
    const description = order.description;
    const deliveryDate = order.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Packs: ${packs}</p>
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async bronzePackageOrderMail(
    email: string,
    packageOrder: SurprisePackageOrderEntity,
  ): Promise<any> {
    const name = packageOrder.packageOrderName;
    const packageType = packageOrder.packageName;
    const content = [
      packageOrder.bronzePackage.itemOne,
      packageOrder.bronzePackage.itemTwo,
      packageOrder.bronzePackage.itemThree,
      packageOrder.bronzePackage.itemFour,
      packageOrder.bronzePackage.itemFive,
      packageOrder.bronzePackage.itemSix,
    ];
    const price = packageOrder.price;
    const status = packageOrder.status;
    const description = packageOrder.bronzePackage.description;
    const addInfo = packageOrder.addInfo;
    const deliveryDate = packageOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Content: ${content[0]}  </p>
                         <p> ${content[1]} </p>
                         <p> ${content[2]} </p>
                         <p> ${content[3]} </p>
                         <p> ${content[4]} </p>
                         <p> ${content[5]} </p>
            
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> Additional Information: ${addInfo}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async silverPackageOrderMail(
    email: string,
    packageOrder: SurprisePackageOrderEntity,
  ): Promise<any> {
    const name = packageOrder.packageOrderName;
    const packageType = packageOrder.packageName;
    const content = [
      packageOrder.silverPackage.itemOne,
      packageOrder.silverPackage.itemTwo,
      packageOrder.silverPackage.itemThree,
      packageOrder.silverPackage.itemFour,
      packageOrder.silverPackage.itemFive,
      packageOrder.silverPackage.itemSix,
      packageOrder.silverPackage.itemSeven,
      packageOrder.silverPackage.itemEight,
    ];
    const price = packageOrder.price;
    const status = packageOrder.status;
    const description = packageOrder.silverPackage.description;
    const addInfo = packageOrder.addInfo;
    const deliveryDate = packageOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Content: ${content[0]}  </p>
                         <p> ${content[1]} </p>
                         <p> ${content[2]} </p>
                         <p> ${content[3]} </p>
                         <p> ${content[4]} </p>
                         <p> ${content[5]} </p>
                         <p> ${content[6]} </p>
                         <p> ${content[7]} </p>
            
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> Additional Information: ${addInfo}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async goldPackageOrderMail(
    email: string,
    packageOrder: SurprisePackageOrderEntity,
  ): Promise<any> {
    const name = packageOrder.packageOrderName;
    const packageType = packageOrder.packageName;
    const content = [
      packageOrder.goldPackage.itemOne,
      packageOrder.goldPackage.itemTwo,
      packageOrder.goldPackage.itemThree,
      packageOrder.goldPackage.itemFour,
      packageOrder.goldPackage.itemFive,
      packageOrder.goldPackage.itemSix,
      packageOrder.goldPackage.itemSeven,
      packageOrder.goldPackage.itemEight,
      packageOrder.goldPackage.itemNine,
      packageOrder.goldPackage.itemTen,
    ];
    const price = packageOrder.price;
    const status = packageOrder.status;
    const description = packageOrder.goldPackage.description;
    const addInfo = packageOrder.addInfo;
    const deliveryDate = packageOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Content: ${content[0]}  </p>
                         <p> ${content[1]} </p>
                         <p> ${content[2]} </p>
                         <p> ${content[3]} </p>
                         <p> ${content[4]} </p>
                         <p> ${content[5]} </p>
                         <p> ${content[6]} </p>
                         <p> ${content[7]} </p>
                         <p> ${content[8]} </p>
                         <p> ${content[9]} </p>
            
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> Additional Information: ${addInfo}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async diamondPackageOrderMail(
    email: string,
    packageOrder: SurprisePackageOrderEntity,
  ): Promise<void> {
    const name = packageOrder.packageOrderName;
    const packageType = packageOrder.packageName;
    const content = [
      packageOrder.diamondPackage.itemOne,
      packageOrder.diamondPackage.itemTwo,
      packageOrder.diamondPackage.itemThree,
      packageOrder.diamondPackage.itemFour,
      packageOrder.diamondPackage.itemFive,
      packageOrder.diamondPackage.itemSix,
      packageOrder.diamondPackage.itemSeven,
      packageOrder.diamondPackage.itemEight,
      packageOrder.diamondPackage.itemNine,
      packageOrder.diamondPackage.itemTen,
      packageOrder.diamondPackage.itemEleven,
      packageOrder.diamondPackage.itemTwelve,
    ];
    const price = packageOrder.price;
    const status = packageOrder.status;
    const description = packageOrder.diamondPackage.description;
    const addInfo = packageOrder.addInfo;
    const deliveryDate = packageOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Content: ${content[0]}  </p>
                         <p> ${content[1]} </p>
                         <p> ${content[2]} </p>
                         <p> ${content[3]} </p>
                         <p> ${content[4]} </p>
                         <p> ${content[5]} </p>
                         <p> ${content[6]} </p>
                         <p> ${content[7]} </p>
                         <p> ${content[8]} </p>
                         <p> ${content[9]} </p>
                         <p> ${content[10]} </p>
                         <p> ${content[11]} </p>
            
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> Additional Information: ${addInfo}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
    }
  }

  async updatePackageOrderMail(
    email: string,
    packageOrder: SurprisePackageOrderEntity,
  ): Promise<void> {
    const name = packageOrder.packageOrderName;
    const packageType = packageOrder.packageName;
    let content;
    if (packageType === 'Bronze') {
      content = [
        packageOrder.bronzePackage.itemOne,
        packageOrder.bronzePackage.itemTwo,
        packageOrder.bronzePackage.itemThree,
        packageOrder.bronzePackage.itemFour,
        packageOrder.bronzePackage.itemFive,
        packageOrder.bronzePackage.itemSix,
      ];
    } else if (packageType === 'Silver') {
      content = [
        packageOrder.silverPackage.itemOne,
        packageOrder.silverPackage.itemTwo,
        packageOrder.silverPackage.itemThree,
        packageOrder.silverPackage.itemFour,
        packageOrder.silverPackage.itemFive,
        packageOrder.silverPackage.itemSix,
        packageOrder.silverPackage.itemSeven,
        packageOrder.silverPackage.itemEight,
      ];
    } else if (packageType === 'Gold') {
      content = [
        packageOrder.goldPackage.itemOne,
        packageOrder.goldPackage.itemTwo,
        packageOrder.goldPackage.itemThree,
        packageOrder.goldPackage.itemFour,
        packageOrder.goldPackage.itemFive,
        packageOrder.goldPackage.itemSix,
        packageOrder.goldPackage.itemSeven,
        packageOrder.goldPackage.itemEight,
        packageOrder.goldPackage.itemNine,
        packageOrder.goldPackage.itemTen,
      ];
    } else if (packageType === 'diamond') {
      [
        packageOrder.diamondPackage.itemOne,
        packageOrder.diamondPackage.itemTwo,
        packageOrder.diamondPackage.itemThree,
        packageOrder.diamondPackage.itemFour,
        packageOrder.diamondPackage.itemFive,
        packageOrder.diamondPackage.itemSix,
        packageOrder.diamondPackage.itemSeven,
        packageOrder.diamondPackage.itemEight,
        packageOrder.diamondPackage.itemNine,
        packageOrder.diamondPackage.itemTen,
        packageOrder.diamondPackage.itemEleven,
        packageOrder.diamondPackage.itemTwelve,
      ];
    }
    const price = packageOrder.price;
    const status = packageOrder.status;
    let description;
    if (packageType === 'Bronze') {
      description = packageOrder.bronzePackage.description;
    } else if (packageType === 'Silver') {
      description = packageOrder.silverPackage.description;
    } else if (packageType === 'Gold') {
      description = packageOrder.goldPackage.description;
    } else if (packageType === 'Diamond') {
      description = packageOrder.diamondPackage.description;
    }
    const addInfo = packageOrder.addInfo;
    const deliveryDate = packageOrder.deliveryDate;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.logger.error(`Invalid email format: ${email}`);
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: Gmail_User,
      to: email,
      subject: 'Moonbeam Cakes Order',
      html: ` 
          Dear ${email}, This is to notify you that your order </br> 
             <p> Order Name: ${name}</p>
             <p> Package: ${packageType}</p>
             <p> Content: ${content[0]}  </p>
                         <p> ${content[1]} </p>
                         <p> ${content[2]} </p>
                         <p> ${content[3]} </p>
                         <p> ${content[4]} </p>
                         <p> ${content[5]} </p>
                         <p> ${content[6]} </p>
                         <p> ${content[7] ? content[7] : ''} </p>
                         <p> ${content[8] ? content[8] : ''} </p>
                         <p> ${content[9] ? content[9] : ''} </p>
                         <p> ${content[10] ? content[10] : ''} </p>
                         <p> ${content[11] ? content[11] : ''} </p>
            
             <p> Price: ${price}</p>
             <p> Status: ${status}</p>
             <p> Description: ${description}</p>
             <p> Additional Information: ${addInfo}</p>
             <p> DeliveryDate: ${deliveryDate} </p>  </br> 
          has been successfully placed.
          We will get back to you shortly`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`User ${email} product order mail sent successfully`);
    } catch (error) {
      this.logger.error(`User ${email} invalid email address`);
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
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
      throw new InternalServerErrorException(
        `user with email ${email} not found`,
      );
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
      throw new InternalServerErrorException(`failed to send delivery token`);
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
      throw new InternalServerErrorException(`user with ${email} invalid`);
    }
  }
}
