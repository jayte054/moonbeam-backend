import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    paymentId: string;

    @Column()
    userId: string;

    @Column()
    amount: string;

    @Column()
    reference: string;

    @Column()
    iv: string;

    @Column()
    status: string;

    @ManyToOne(() => AuthEntity, (user) => user.paymentId,{eager: false})
    user: AuthEntity;

    @Column()
    date: string;

}