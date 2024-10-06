import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/authModule/authmodule";
import { MailerModule } from "src/mailerModule/mailerModule";
import { PaymentController } from "./paymentController/paymentController";
import { PaymentEntity } from "./paymentEntity/paymentEntity";
import { PaymentRepository } from "./paymentRepository/paymentRepository";
import { PaymentService } from "./paymentService/paymentService";

@Module({
    imports: [
        AuthModule,
        MailerModule,
        TypeOrmModule.forFeature([PaymentEntity])
    ],
    providers: [PaymentEntity, PaymentRepository, PaymentService],
    controllers:[PaymentController],
    exports: []
})

export class PaymentModule {}