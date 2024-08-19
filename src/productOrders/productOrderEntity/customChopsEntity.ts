import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../ProductOrderEnum/productOrderEnum";

@Entity()
export class CustomChopsOrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  chopsId: string;

  @Column()
  orderName: string;

  @Column()
  chopType: string;

  @Column()
  numberOfPacks: string;

  @Column()
  price: string;

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

  @Column()
  description: string;

  @ManyToOne(() => AuthEntity, (user) => user.chopsId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}