import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CakeVariantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  variantId: string;

  @Column()
  orderName: string;

  @Column()
  quantity: string;

  @Column()
  description: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AuthEntity, (user) => user.variantId, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
