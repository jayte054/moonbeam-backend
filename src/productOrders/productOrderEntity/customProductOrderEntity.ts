import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  CategoryType,
  DesignCovering,
  OrderStatus,
  ProductFlavours,
  ProductInch,
  ProductLayers,
  ProductType,
} from '../ProductOrderEnum/productOrderEnum';

@Entity()
export class CustomOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  customCakeId: string;

  @Column()
  orderName: string;

  @Column()
  type: ProductType;

  @Column()
  category: CategoryType;

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
  price?: string;

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

  @ManyToOne(() => AuthEntity, (user) => user.customCakeId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
