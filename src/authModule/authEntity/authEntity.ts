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

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
