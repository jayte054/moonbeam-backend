import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  rateId: string;

  @Column()
  chocolateCakeRate?: string;

  @Column()
  strawberryCakeRate?: string;

  @Column()
  vanillaCakeRate?: string;

  @Column()
  redvelvetCakeRate?: string;

  @Column()
  carrotCakeRate?: string;

  @Column()
  cheeseCakeRate?: string;

  @Column()
  bananaCakeRate?: string;

  @Column()
  appleCakeRate?: string;

  @Column()
  lemonCakeRate?: string;

  @Column()
  coffeeCakeRate?: string;

  @Column()
  coconutCakeRate?: string;

  @Column()
  blueberryCakeRate?: string;

  @Column()
  samosaRate?: string;
  
  @Column()
  springRollRate?: string;
  
  @Column()
  samosa_springrollRate?: string;
  
  @Column()
  puffRate?: string;
  
  @Column()
  pepperedMeatRate?: string;
  
  @Column()
  puff_pepperedMeatRate?: string;
  
  @Column()
  samosa_pepperedMeatRate?: string;
  
  @Column()
  springroll_pepperedMeatRate?: string;

   @Column()
  meatPieRate?: string;

   @Column()
  donutsRate?: string;

   @Column()
  cinamonRollsRate?: string;

   @Column()
  pancakesRate?: string;

   @Column()
  corndogsRate?: string;

   @Column()
  waffelsRate?: string;

   @Column()
  meatpie_donutsRate?: string;

   @Column()
  pancakes_corndogs_waffelsRate?: string;

  @ManyToOne(() => AdminAuthEntity, (admin) => admin.chocolateCakeRate, {
    eager: false,
  })
  admin: AdminAuthEntity;

  @Column()
  adminId: string;
}
