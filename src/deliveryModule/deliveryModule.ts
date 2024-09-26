import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from '../authModule/authmodule';
import { DefaultStudioEntity } from "./defaultStudioAddressEntity/defaultStudioAddressEntity";
import { DefaultStudioRepository } from "./defaultStudioRepository/defaultStudioRepository";
import { DeliveryController } from "./deliveryController/deliveryController";
import { DeliveryAddressEntity } from "./deliveryEntity/deliveryAddressEntity";
import { DeliveryAddressRepository } from "./deliveryRepository/deliveryRepository";
import { DeliveryService } from "./deliveryService/deliveryService";


@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([DeliveryAddressEntity, DefaultStudioEntity])
    ],
    providers: [DeliveryAddressRepository, DefaultStudioRepository, DeliveryService, DeliveryAddressEntity],
    controllers: [DeliveryController]
})
export class DeliveryModule {}