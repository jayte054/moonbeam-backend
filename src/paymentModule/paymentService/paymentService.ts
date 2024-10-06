import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { PaymentObject, verificationDto } from "src/types";
import { PaymentDto } from "../paymentDto/paymentDto";
import { PaymentRepository } from "../paymentRepository/paymentRepository";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(PaymentRepository)
        private paymentRepository: PaymentRepository
    ){}

    initiatePayment = async (user: AuthEntity, paymentDto: PaymentDto): Promise<PaymentObject> => {
        return await this.paymentRepository.initiatePayment(user, paymentDto)
    }

    verifyPayment = async (user: AuthEntity, verificationDto: verificationDto) => {
        return await this.paymentRepository.verifyPayment(user, verificationDto)
    }
}