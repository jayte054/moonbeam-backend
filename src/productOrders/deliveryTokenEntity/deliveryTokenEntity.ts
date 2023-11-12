import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthEntity } from '../../authModule/authEntity/authEntity';

@Entity()
export class DeliveryTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  deliveryToken: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => AuthEntity, (user) => user.resetToken, { eager: false })
  user: AuthEntity;

  @Column()
  userId: string;
}
