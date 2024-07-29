import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  DesignCovering,
  OrderStatus,
  ChopPackageType,
  NumberOfPacks,
  PastryPackageType,
  ChopProductType,
  Covering,
} from '../ProductOrderEnum/productOrderEnum';

@Entity()
export class ChopsOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderTitle: string;

  @Column()
  type: ChopProductType;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  chopPackageType?: ChopPackageType;

  @Column({ nullable: true })
  customChopPackage?: string;

  @Column()
  numberOfPacks: NumberOfPacks;

  @Column({ nullable: true })
  customNumberOfPacks?: string;

  @Column({ nullable: true })
  pastryPackageType?: PastryPackageType;

  @Column({ nullable: true })
  customPastryPackage?: string;

  @Column({ nullable: true })
  covering?: Covering;

  @Column()
  rate: string;

  @Column()
  coveringRate: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.progress,
  })
  status: OrderStatus;

  @Column({ default: new Date() })
  orderDate: string;

  @Column({ type: 'timestamp', nullable: false })
  deliveryDate: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AuthEntity, (user) => user.orderTitle, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
