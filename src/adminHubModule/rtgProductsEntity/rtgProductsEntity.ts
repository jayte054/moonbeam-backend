import { AdminAuthEntity } from "src/authModule/adminAuthEntity/adminAuthEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { productVariant } from "../types";

@Entity()
export class ReadyToGoProductsEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    rtgId: string;

    @Column()
    rtgName: string;

    @Column()
    rtgType: productVariant;

    @Column()
    rtgPrice: string;

    @Column()
    rtgImageUrl: string;

    @Column()
    rtgDescription: string;

    @Column({default: new Date()})
    date: string    

    @ManyToOne(() => AdminAuthEntity, (admin) => admin.id, {eager: false})
    admin: AdminAuthEntity;

    @Column()
    adminId: string;
}