import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  DeliveryStatus,
  CategoryType,
} from '../ProductOrderEnum/productOrderEnum';

@Entity()
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column()
  orderName: string;

  @Column()
  orderDate: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  quantity: string;

  @Column()
  price: string;

  @Column()
  category: CategoryType;

  @Column('text', { array: true })
  content?: string[];

  @Column()
  deliveryDate: string;

  @Column()
  deliveryStatus: DeliveryStatus;

  @ManyToOne(() => AuthEntity, (user) => user.orderId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
