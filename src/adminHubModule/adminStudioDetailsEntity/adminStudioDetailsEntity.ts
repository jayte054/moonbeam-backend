import { AdminAuthEntity } from "src/authModule/adminAuthEntity/adminAuthEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AdminStudioEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
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

    @ManyToOne(() => AdminAuthEntity, (admin) => admin.id, {eager: false})
    admin: AdminAuthEntity;

    @Column()
    adminId: string;
}