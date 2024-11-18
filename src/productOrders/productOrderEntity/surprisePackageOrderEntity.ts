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
import {
  CategoryType,
  OrderStatus,
} from '../ProductOrderEnum/productOrderEnum';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';

@Entity()
export class SurprisePackageOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  packageId: string;

  @Column()
  packageOrderName: string;

  @Column()
  packageName: string;

  @Column('jsonb', { nullable: true })
  bronzePackage?: bronzePackageObject;

  @Column('jsonb', { nullable: true })
  silverPackage?: silverPackageObject;

  @Column('jsonb', { nullable: true })
  goldPackage?: goldPackageObject;

  @Column('jsonb', { nullable: true })
  diamondPackage?: diamondPackageObject;

  category: CategoryType;

  @Column()
  imageUrl: string;

  @Column()
  price: string;

  @Column({ default: new Date() })
  orderDate: string;

  @Column()
  deliveryDate: string;

  @Column()
  addInfo: string;

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
