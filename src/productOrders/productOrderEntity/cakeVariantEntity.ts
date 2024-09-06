import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus, VariantType } from '../ProductOrderEnum/productOrderEnum';

@Entity()
export class CakeVariantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  variantId: string;

  @Column()
  orderName: string;

  @Column()
  quantity: string;

  @Column()
  type: VariantType;

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  status: OrderStatus

  @Column()
  orderDate: string;

  @Column({ default: new Date() })
  deliveryDate: string;

  @ManyToOne(() => AuthEntity, (user) => user.variantId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
