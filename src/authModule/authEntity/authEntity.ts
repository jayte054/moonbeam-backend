import {
  Entity,
  BaseEntity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PasswordResetTokenEntity } from '../passwordResetTokenEntity/passwordResetTokenEntity';
import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';
import { ChopsOrderEntity } from 'src/productOrders/productOrderEntity/chopsOrderEntity';
import { SurprisePackageOrderEntity } from 'src/productOrders/productOrderEntity/surprisePackageOrderEntity';
import { BudgetCakeOrderEntity } from 'src/productOrders/productOrderEntity/budgetCakeOrderEntity';
import { CakeVariantEntity } from 'src/productOrders/productOrderEntity/cakeVariantEntity';
import { CustomOrderEntity } from 'src/productOrders/productOrderEntity/customProductOrderEntity';
import { CustomChopsOrderEntity } from 'src/productOrders/productOrderEntity/customChopsEntity';
import { CartEntity } from 'src/productOrders/productOrderEntity/cartEntity';
import { DeliveryAddressEntity } from 'src/deliveryModule/deliveryEntity/deliveryAddressEntity';
import { DefaultStudioEntity } from 'src/deliveryModule/defaultStudioAddressEntity/defaultStudioAddressEntity';
import { PaymentEntity } from 'src/paymentModule/paymentEntity/paymentEntity';
import { RequestEntity } from 'src/productOrders/productOrderEntity/requestEntity';
import { OrderEntity } from 'src/productOrders/productOrderEntity/ordersEntity';

@Entity()
@Unique(['email'])
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => PasswordResetTokenEntity, (resetToken) => resetToken.user, {
    eager: true,
  })
  resetToken: PasswordResetTokenEntity[];

  @OneToMany(() => ProductOrderEntity, (orderName) => orderName.user, {
    eager: true,
  })
  orderName: ProductOrderEntity;

  @OneToMany(() => CustomOrderEntity, (customCakeId) => customCakeId.user, {
    eager: true,
  })
  customCakeId: CustomOrderEntity;

  @OneToMany(() => CustomOrderEntity, (customCakeId) => customCakeId.user, {
    eager: true,
  })
  customPackageId: CustomOrderEntity;

  @OneToMany(() => CustomChopsOrderEntity, (chopsId) => chopsId.user, {
    eager: true,
  })
  chopsId: CustomChopsOrderEntity;

  @OneToMany(() => BudgetCakeOrderEntity, (budgetCakeId) => budgetCakeId.user, {
    eager: true,
  })
  budgetCakeId: BudgetCakeOrderEntity;

  @OneToMany(() => ChopsOrderEntity, (orderTitle) => orderTitle.user, {
    eager: true,
  })
  orderTitle: ChopsOrderEntity;

  @OneToMany(
    () => SurprisePackageOrderEntity,
    (packageName) => packageName.user,
    {
      eager: true,
    },
  )
  packageName: SurprisePackageOrderEntity;

  @OneToMany(() => CakeVariantEntity, (variantId) => variantId.user, {
    eager: true,
  })
  variantId: CakeVariantEntity;

  @OneToMany(() => CartEntity, (itemId) => itemId.user, {eager: true})
  itemId: CartEntity;

  @OneToMany(() => DeliveryAddressEntity, (deliveryAddressId) => deliveryAddressId.user, {eager: true})
  deliveryAddressId: DeliveryAddressEntity;

  @OneToMany(() => DefaultStudioEntity, (studioId) => studioId.user, {eager: true})
  studioId: string;

  @OneToMany(() => PaymentEntity, (paymentId) => paymentId.user, {eager: true})
  paymentId: string;

  @OneToMany(() => RequestEntity, (requestId) => requestId.user, {eager: true})
  requestId: string;

  @OneToMany(() => OrderEntity, (orderId) => orderId.user, {eager: true})
  orderId: string;
  
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
