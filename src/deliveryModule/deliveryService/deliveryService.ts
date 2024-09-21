import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { DeliveryAddressObject } from "src/types";
import { DeliveryAddressDto, UpdateAddressDto } from "../deliveryDto/deliveryAddressDto";
import { DeliveryAddressEntity } from "../deliveryEntity/deliveryAddressEntity";
import { DeliveryAddressRepository } from "../deliveryRepository/deliveryRepository";

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(DeliveryAddressRepository)
        private deliveryAddressRepository: DeliveryAddressRepository
    ) {}

    createDeliveryAddress = async (user: AuthEntity, deliveryAddressDto: DeliveryAddressDto): Promise<DeliveryAddressObject> => {
        return await this.deliveryAddressRepository.createDeliveryAddress(user, deliveryAddressDto)
    }

    getAddresses = async(user: AuthEntity): Promise<DeliveryAddressEntity[]> => {
        return await this.deliveryAddressRepository.getAddresses(user)
    }

    updateAddress = async (user: AuthEntity, updateAddressDto: UpdateAddressDto, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        return await this.deliveryAddressRepository.updateAddress(user, updateAddressDto, deliveryAddressId)
    }

    defaultAddress = async (user: AuthEntity, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        return await this.deliveryAddressRepository.defaultAddress(user, deliveryAddressId)
    }

}