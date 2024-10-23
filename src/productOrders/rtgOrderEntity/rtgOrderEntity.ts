import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../ProductOrderEnum/productOrderEnum";

@Entity()
export class RtgOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  rtgOrderId: string;

  @Column()
  orderName: string;

  @Column()
  orderType: string;

  @Column({nullable: true})
  cakeMessage?: string;

  @Column()
  imageUrl: string;

  @Column()
  orderDate: string;

  @Column()
  status: OrderStatus;

  @Column()
  deliveryDate: string;

  @Column()
  price: string;

  @ManyToOne(() => AuthEntity, (user) => user.id, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}