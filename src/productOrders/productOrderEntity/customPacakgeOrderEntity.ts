import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../ProductOrderEnum/productOrderEnum";

@Entity()
export class CustomPackageOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  customPackageId: string;

  @Column()
  orderName: string;

  @Column('text', {array:true})
  item: string[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.progress,
  })
  status: OrderStatus;

  @Column({nullable:true})
  price?: string;

  @Column({ type: 'timestamp', nullable: false })
  deliveryDate: string;

  @Column({ default: new Date() })
  orderDate: string;

  @Column()
  addInfo: string;

  @ManyToOne(() => AuthEntity, (user) => user.customPackageId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}