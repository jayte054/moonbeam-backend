import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import crypto from "crypto";
import CryptoJS from 'crypto-js';
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { MailerService } from "src/mailerModule/mailerService";
import { CartEntity } from "src/productOrders/productOrderEntity/cartEntity";
import { ProductType } from "src/productOrders/ProductOrderEnum/productOrderEnum";
import { BudgetCakeOrderRepository } from "src/productOrders/productOrderRepository/budgetCakeOrderRepository";
import { CakeVariantRepository } from "src/productOrders/productOrderRepository/cakeVariantRepository";
import { CartRepository } from "src/productOrders/productOrderRepository/cartRepository";
import { ChopsOrderRepository } from "src/productOrders/productOrderRepository/chopsOrderRepository";
import { ProductRepository } from "src/productOrders/productOrderRepository/productOrderRepository";
import { SurprisePackageOrderRepository } from "src/productOrders/productOrderRepository/surprisePackageOrderRepository";
import { ProductService } from "src/productOrders/productOrderService/productOrderService";
import { CartObject, PaymentObject, verificationDto } from "src/types";
import { DataSource, Repository } from "typeorm";
import { PaymentDto } from "../paymentDto/paymentDto";
import { PaymentEntity } from "../paymentEntity/paymentEntity";

@Injectable()
export class PaymentRepository extends Repository<PaymentEntity> {
  private logger = new Logger('PaymentRepository');
  constructor(
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(BudgetCakeOrderRepository)
    private budgetCakeOrderRepository: BudgetCakeOrderRepository,
    @InjectRepository(CakeVariantRepository)
    private cakeVariantRepository: CakeVariantRepository,
    @InjectRepository(ChopsOrderRepository)
    private chopsOrderRepository: ChopsOrderRepository,
    @InjectRepository(SurprisePackageOrderRepository)
    private surprisePackageOrderRepository: SurprisePackageOrderRepository,
  ) {
    super(PaymentEntity, dataSource.createEntityManager());
  }

  initiatePayment = async (
    user: AuthEntity,
    paymentDto: PaymentDto,
  ): Promise<PaymentObject> => {
    const { userId, amount } = paymentDto;

    const reference = `ref_${crypto.randomBytes(8).toString('hex')}`;
    const iv = crypto.randomBytes(16);
    const randomKey = crypto.randomBytes(32);
    const key = crypto
      .createHash('sha256')
      .update(
        Buffer.concat([randomKey, Buffer.from(process.env.Encryption_Secret)]),
      ) // Concatenate the random key and the secret
      .digest(); // Hash the result to get a fixed-length key

    // Encrypt the reference
    const cipher = crypto.createCipheriv(process.env.Algorithm!, key, iv);
    console.log(key.length);

    const encryptedReference =
      cipher.update(reference, 'utf8', 'hex') + cipher.final('hex');
    console.log(encryptedReference);
    const newPayment = new PaymentEntity();

    newPayment.userId = userId;
    newPayment.amount = amount;
    newPayment.status = 'pending';
    newPayment.reference = encryptedReference;
    newPayment.iv = iv.toString('hex');
    newPayment.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    newPayment.user = user;
    console.log(newPayment);
    try {
      await newPayment.save();
      this.logger.verbose('payment initialized successfully');
      return {
        paymentId: newPayment.paymentId,
        userId: newPayment.userId,
        amount: newPayment.amount,
        reference: newPayment.reference,
        iv: newPayment.iv,
        status: newPayment.status,
        date: newPayment.date,
      };
    } catch (error) {
      this.logger.error('error creating reference');
      throw new InternalServerErrorException('error creating reference');
    }
  };

  getPayments = async (): Promise<PaymentEntity[]> => {
    try {
      const payments = await this.find();
      return payments;
    } catch (error) {
      this.logger.error('error fetching payments');
    }
  };

  getPaymentById = async (
    user: AuthEntity,
    paymentId: string,
  ): Promise<PaymentEntity> => {
    const payment = await this.findOne({
      where: {
        paymentId,
        userId: user.id,
      },
    });
    if (!payment) {
      this.logger.error(`address with id ${paymentId} not found`);
      throw new NotFoundException(`payment not found`);
    }

    try {
      this.logger.verbose(`successfully fetched payment with id ${paymentId}`);
      return payment;
    } catch (error) {
      this.logger.error(`failed to fetch  payment with id ${paymentId}`);
      throw new InternalServerErrorException('payment not found');
    }
  };

  verifyPayment = async (
    user: AuthEntity,
    verificationDto: verificationDto,
  ): Promise<string> => {
    const { reference, iv, paymentId } = verificationDto;
    const decryptedRefrence = this.decryptReference(reference, iv);
    try {
      const verificationResponse = await this.verifyWithPaystack(
        decryptedRefrence,
      );

      if (verificationResponse.status === true) {
        const payment = await this.getPaymentById(user, paymentId);
        payment.status = 'verified';
        await payment.save();
        this.logger.verbose(
          `payment with reference ${reference} successfully verified`,
        );
        await this.sendOrderMail(user);
        return 'payment verified and saved';
      }
    } catch (error) {
      console.log(error);
      this.logger.error(`error verifying payment with reference ${reference}`);
      throw new InternalServerErrorException('Error verifying payment');
    }
  };

  private decryptReference = (
    encryptedReference: string,
    iv: string,
  ): string => {
    try {
      const key = CryptoJS.enc.Hex.parse(process.env.Decryption_Secret!);
      const ivHex = CryptoJS.enc.Hex.parse(iv);

      const decrypted = CryptoJS.AES.decrypt(encryptedReference, key, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Convert the decrypted data to UTF-8 string
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.log(error);
      this.logger.error('Error decrypting the reference');
    }
  };

  private verifyWithPaystack = async (reference: string) => {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.Paystack_Secret_Key}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response status is OK (status 200)
      if (!response.ok) {
        this.logger.error(
          `Failed to verify payment. Status: ${response.status}`,
        );
        throw new InternalServerErrorException(
          `Paystack verification failed with status: ${response.status}`,
        );
      }

      // Check if the response body exists and has content
      const text = await response.text(); // Get response as text
      if (!text) {
        this.logger.error('Empty response from Paystack');
        throw new Error('Empty response from Paystack');
      }

      // Attempt to parse the JSON
      try {
        const result = JSON.parse(text);
        this.logger.log('payment verified');
        return result;
      } catch (error) {
        this.logger.error(
          'Failed to parse JSON response from Paystack:',
          error,
        );
        throw new InternalServerErrorException(
          'Failed to parse JSON response from Paystack',
        );
      }
    } catch (error) {
      this.logger.error('Error verifying payment with Paystack:', error);
      throw new InternalServerErrorException(
        'Error verifying payment with Paystack',
      );
    }
  };

  private sendOrderMail = async (user: AuthEntity) => {
    try {
      const cartItems: CartEntity[] = await this.cartRepository.fetchCartItems(
        user,
      );
    //   const productIds = cartItems.map((cartItem) => {
    //     return cartItem.productOrderId;
    //   });
    //   const products = await Promise.all(
    //     productIds.map(async (productId) => {
    //       return (
    //         (await this.productRepository.getOrderWithId(productId, user)) ||
    //         (await this.budgetCakeOrderRepository.getOrderWithId(
    //           productId,
    //           user,
    //         )) ||
    //         (await this.cakeVariantRepository.getOrderWithId(
    //           productId,
    //           user,
    //         )) ||
    //         (await this.chopsOrderRepository.getChopOrderWithId(
    //           productId,
    //           user,
    //         )) ||
    //         (await this.surprisePackageOrderRepository.getSurprisePackageOrdersWithId(
    //           productId,
    //           user,
    //         ))
    //       );
    //     }),
    //   );
    //   const productMap: { [key: string]: string } = {
    //     [ProductType.Traditional]: 'Traditional',
    //     [ProductType.Wedding]: 'Wedding',
    //     [ProductType.Birthday]: 'Birthday',
    //     [ProductType.Anniversary]: 'Anniversary',
    //     [ProductType.Chops_Pastries]: 'Chops / Pastries',
    //     [ProductType.Surprise_Package]: 'surprise package',
    //     [ProductType.Cake_Variant]: 'cake variant',
    //   };

    //   // Send email for each product
    //   await Promise.all(
    //     products.map(async (product) => {
    //       const productType = productMap[product.type];

    //       switch (productType) {
    //         case 'Traditional':
    //         case 'Wedding':
    //         case 'Birthday':
    //         case 'Anniversary':
    //           // Send product order or budget cake mail
    //           await this.mailerService.productOrderMail(user.email, product);
    //           await this.mailerService.budgetCakeOrderMail(user.email, product);
    //           break;

    //         case 'Chops / Pastries':
    //           // Send chops order mail
    //           await this.mailerService.chopsOrderMail(user.email, product);
    //           break;

    //         case 'surprise package':
    //           // Send surprise package email based on package type
    //           if (product.bronzePackage) {
    //             await this.mailerService.bronzePackageOrderMail(
    //               user.email,
    //               product,
    //             );
    //           } else if (product.silverPackage) {
    //             await this.mailerService.silverPackageOrderMail(
    //               user.email,
    //               product,
    //             );
    //           } else if (product.goldPackage) {
    //             await this.mailerService.goldPackageOrderMail(
    //               user.email,
    //               product,
    //             );
    //           } else if (product.diamondPackage) {
    //             await this.mailerService.diamondPackageOrderMail(
    //               user.email,
    //               product,
    //             );
    //           }
    //           break;

    //         case 'cake variant':
    //           // Handle specific cake variant types
    //           if (product.type === 'foilCake') {
    //             await this.mailerService.foilCakeOrderMail(user.email, product);
    //           } else if (product.type === 'cakeParfait') {
    //             await this.mailerService.cakeParfaitOrderMail(
    //               user.email,
    //               product,
    //             );
    //           }
    //           break;

    //         default:
    //           // Fallback email for unknown product types
             const sendMail = cartItems.map(
               async (cartItem) => {
                 await this.mailerService.defaultMail(user.email, cartItem);
                 await this.cartRepository.deleteCartItem(user, cartItem.itemId);
             }); 
             return Promise.all(sendMail)
            //   break;
    //       }
    //     }),
    //   );
    } catch (error) {
        console.log(error)
      this.logger.error(`failed to send order mail for user ${user.email}`);
      throw new InternalServerErrorException('failed to send order mail');
    }
  };
}