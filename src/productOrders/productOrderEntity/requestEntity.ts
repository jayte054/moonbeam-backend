import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RequestEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  requestId: string;

  @Column()
  requestTitle: string;

  @Column()
  orderType: string;

  @Column('text', { array: true })
  content: string[];

  @Column()
  quantity: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  deliveryDate: string;

  @Column()
  status: string;

  @Column()
  productOrderId: string;

  @ManyToOne(() => AuthEntity, (user) => user.requestId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}