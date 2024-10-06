import { Body, Controller, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { GetUser } from "src/authModule/getUserDecorator/getUserDecorator";
import { PaymentObject, verificationDto } from "src/types";
import { PaymentDto } from "../paymentDto/paymentDto";
import { PaymentService } from "../paymentService/paymentService";

@Controller('payment')
@UseGuards(AuthGuard())
export class PaymentController {
    constructor (private readonly paymentService: PaymentService){}

    @Post('/initiatePayment')
    @UsePipes(ValidationPipe)
    async initiatePayment (
        @GetUser() user: AuthEntity,
        @Body() paymentDto: PaymentDto
    ): Promise<PaymentObject> {
        return await this.paymentService.initiatePayment(user, paymentDto);
    }

    @Patch('/verifyPayment')
    @UsePipes(ValidationPipe)
    async verifyPayment(
        @GetUser() user: AuthEntity,
        @Body() verificationDto: verificationDto
    ): Promise<string> {
        return await this.paymentService.verifyPayment(user, verificationDto)
    }
}