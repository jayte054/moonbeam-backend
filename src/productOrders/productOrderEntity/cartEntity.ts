import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductType } from "../ProductOrderEnum/productOrderEnum";

@Entity()
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  itemId: string;

  @Column()
  itemName: string;

  @Column()
  itemType: string;

  @Column()
  price: string;

  @Column()
  imageUrl: string;

  @Column({nullable: true})
  quantity?: string;

  @Column()
  productOrderId: string;

  @ManyToOne(() => AuthEntity, (user) => user.itemId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}