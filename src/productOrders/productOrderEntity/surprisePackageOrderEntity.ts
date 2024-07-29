import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import {
  bronzePackageObject,
  diamondPackageObject,
  goldPackageObject,
  silverPackageObject,
} from 'src/types';
import { OrderStatus } from '../ProductOrderEnum/productOrderEnum';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';

@Entity()
export class SurprisePackageOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  packageId: string;

  @Column()
  packageName: string;

  @Column('jsonb', { nullable: true })
  bronzePackage?: bronzePackageObject;

  @Column('jsonb', { nullable: true })
  silverPackage?: silverPackageObject;

  @Column('jsonb', { nullable: true })
  gold?: goldPackageObject;

  @Column('jsonb', { nullable: true })
  diamond?: diamondPackageObject;

  @Column()
  price: string;

  @Column({ default: new Date() })
  orderDate: string;

  @Column()
  deliveryDate: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.progress,
  })
  status: OrderStatus;

  @ManyToOne(() => AuthEntity, (user) => user.packageName, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
