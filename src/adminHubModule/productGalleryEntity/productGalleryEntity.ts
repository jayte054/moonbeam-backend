import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductType } from 'src/productOrders/ProductOrderEnum/productOrderEnum';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';


@Entity()
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  type: ProductType;

  @Column()
  imageUrl: string;

  @Column()
  description: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.id, { eager: false })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
