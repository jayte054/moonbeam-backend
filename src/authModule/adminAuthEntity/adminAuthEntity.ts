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
import { ProductRateEntity } from 'src/adminHubModule/productRateEntity/productRateEntity';
import { ProductEntity } from 'src/adminHubModule/productEntity/productEntity';

@Entity()
@Unique(['email'])
export class AdminAuthEntity extends BaseEntity {
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

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => PasswordResetTokenEntity, (resetToken) => resetToken.admin, {
    eager: true,
  })
  resetToken: PasswordResetTokenEntity[];

  @OneToMany(() => ProductEntity, (productId) => productId.admin, {
    eager: true,
  })
  productId: ProductEntity;

  @OneToMany(
    () => ProductRateEntity,
    (chocolateCakeRate) => chocolateCakeRate.admin,
    { eager: true },
  )
  chocolateCakeRate: ProductRateEntity;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    try {
      if (hash === this.password) {
        return hash === this.password;
      }
    } catch (error) {
      throw new Error('incorrect password');
    }
  }
}
