import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  profileId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'timestamp', nullable: false })
  dateOfBirth: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => AuthEntity, (user) => user.firstname, {
    eager: false,
  })
  user: AuthEntity;

  @Column()
  userId: string;
}
