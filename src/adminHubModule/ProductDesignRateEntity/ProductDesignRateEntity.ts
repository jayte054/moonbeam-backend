import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Covering} from "src/productOrders/ProductOrderEnum/productOrderEnum"

@Entity()
export class ProductDesignRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  designId: string;

  @Column()
  nakedRate?: string;

  @Column()
  butterCreamRate?: string;

  @Column()
  fundantRate?: string;

  @Column()
  covering?: Covering;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.butterCreamRate, {
    eager: false,
  })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
