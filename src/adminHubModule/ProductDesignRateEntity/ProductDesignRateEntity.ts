import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductDesignRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  designId: string;

  @Column()
  nakedRate: string;

  @Column()
  butterCreamRate: string;

  @Column()
  fundantRate: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.butterCreamRate, {
    eager: false,
  })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
