import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  rateId: string;

  @Column()
  chocolateCakeRate?: string;

  @Column()
  strawberryCakeRate?: string;

  @Column()
  vanillaCakeRate?: string;

  @Column()
  redvelvetCakeRate?: string;

  @Column()
  carrotCakeRate?: string;

  @Column()
  cheeseCakeRate?: string;

  @Column()
  bananaCakeRate?: string;

  @Column()
  appleCakeRate?: string;

  @Column()
  lemonCakeRate?: string;

  @Column()
  coffeeCakeRate?: string;

  @Column()
  coconutCakeRate?: string;

  @Column()
  blueberryCakeRate?: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.chocolateCakeRate, {
    eager: false,
  })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
