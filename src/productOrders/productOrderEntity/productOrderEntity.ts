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
  ProductFlavours,
  ProductInch,
  ProductLayers,
  ProductType,
} from '../ProductOrderEnum/productOrderEnum';

@Entity()
export class ProductOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderName: string;

  @Column()
  type: ProductType;

  @Column()
  imageUrl: string;

  @Column()
  productFlavour: ProductFlavours;

  @Column()
  designCovering: DesignCovering;

  @Column()
  layers: ProductLayers;

  @Column()
  inches: ProductInch;

  @Column()
  rate: string;

  @Column()
  designRate: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column()
  status: OrderStatus;

  @Column({ default: new Date() })
  orderDate: string;

  @Column({ type: 'timestamp', nullable: false })
  deliveryDate: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AuthEntity, (user) => user.orderName, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
