import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DeliveryAddressEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    deliveryAddressId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: number;

    @Column({nullable: true})
    additionalPhoneNumber?: number;

    @Column()
    deliveryAddress: string;

    @Column()
    region: string;

    @Column()
    city: string;

    @Column()
    defaultAddress: boolean;

    @ManyToOne(() => AuthEntity, (user) => user.deliveryAddressId, {
        eager: false
    })
    user: AuthEntity;

    @Column()
    userId: string;
}