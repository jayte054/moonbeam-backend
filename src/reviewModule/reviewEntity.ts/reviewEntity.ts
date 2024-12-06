import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReviewStatus } from '../reviewDto/reviewDto';

@Entity()
export class ReviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  review: string;

  @Column()
  isActive: ReviewStatus;

  @Column()
  date: string;
}
