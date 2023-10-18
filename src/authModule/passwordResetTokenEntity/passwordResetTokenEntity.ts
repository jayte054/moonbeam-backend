import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AuthEntity } from '../authEntity/authEntity';

@Entity()
export class PasswordResetTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => AuthEntity, (user) => user.resetToken, { eager: false })
  user: AuthEntity;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.resetToken, {
    eager: false,
  })
  admin: AdminAuthEntity;

  @Column()
  userId?: string;

  @Column()
  adminId?: string;
}
