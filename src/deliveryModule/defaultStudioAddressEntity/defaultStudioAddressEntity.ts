import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DefaultStudioEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studioId: string;

  @Column()
  studioTitle: string;

  @Column()
  studioAddress: string;

  @Column()
  LGA: string;

  @Column()
  state: string;

  @Column()
  phoneNumber: string;

  @Column()
  deliveryBaseFee: string;

  @Column()
  deliveryPricePerKm: string;

  @Column()
  defaultStudioAddress: boolean;

  @ManyToOne(() => AuthEntity, (user) => user.id, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
