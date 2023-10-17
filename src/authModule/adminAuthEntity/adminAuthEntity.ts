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
import { ProductOrderEntity } from 'src/products/productEntity/productOrderEntity';

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

  @OneToMany(() => PasswordResetTokenEntity, (resetToken) => resetToken.user, {
    eager: true,
  })
  resetToken: PasswordResetTokenEntity[];

  @OneToMany(() => ProductOrderEntity, (orderName) => orderName.user, {
    eager: true,
  })
  orderName: ProductOrderEntity;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
