import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';

@Entity()
export class SurprisePackageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  packageId: string;

  @Column()
  packageName: string;

  @Column()
  itemOne: string;

  @Column()
  itemTwo: string;

  @Column()
  itemThree: string;

  @Column()
  itemFour: string;

  @Column()
  itemFive: string;

  @Column()
  itemSix: string;

  @Column({ nullable: true })
  itemSeven?: string;

  @Column({ nullable: true })
  itemEight?: string;

  @Column({ nullable: true })
  itemNine?: string;

  @Column({ nullable: true })
  itemTen?: string;

  @Column({ nullable: true })
  itemEleven?: string;

  @Column({ nullable: true })
  itemTwelve?: string;

  @Column()
  imageUrl: string;

  @Column()
  price: string;

  @Column()
  description: string;

  @Column({ default: new Date() })
  date: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.id, { eager: false })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
