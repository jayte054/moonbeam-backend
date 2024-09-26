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
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { AdminStudioEntity } from 'src/adminHubModule/adminStudioDetailsEntity/adminStudioDetailsEntity';

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

  @OneToMany(
    () => ProductRateEntity,
    (strawberryCakeRate) => strawberryCakeRate.admin,
    { eager: true },
  )
  strawberryCakeRate: ProductRateEntity;

  @OneToMany(() => SurprisePackageEntity, (packageId) => packageId.admin, {
    eager: true,
  })
  packageId: SurprisePackageEntity;

  @OneToMany(
    () => ProductRateEntity,
    (butterCreamRate) => butterCreamRate.admin,
    { eager: true },
  )
  butterCreamRate: ProductRateEntity;

  @OneToMany(() => AdminStudioEntity, (studioDetailsId) =>studioDetailsId.admin, {eager: true})
  studioDetailsId: AdminStudioEntity;
  
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
