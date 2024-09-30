import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { async } from "rxjs";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { DeliveryAddressObject } from "src/types";
import { DefaultStudioEntity } from "../defaultStudioAddressEntity/defaultStudioAddressEntity";
import { DefaultStudioRepository } from "../defaultStudioRepository/defaultStudioRepository";
import { DeliveryAddressDto, UpdateAddressDto } from "../deliveryDto/deliveryAddressDto";
import { DeliveryAddressEntity } from "../deliveryEntity/deliveryAddressEntity";
import { DeliveryAddressRepository } from "../deliveryRepository/deliveryRepository";

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(DeliveryAddressRepository)
        @InjectRepository(DefaultStudioRepository)
        private deliveryAddressRepository: DeliveryAddressRepository,
        private defaultStudioRepository: DefaultStudioRepository
    ) {}

    createDeliveryAddress = async (user: AuthEntity, deliveryAddressDto: DeliveryAddressDto): Promise<DeliveryAddressObject> => {
        return await this.deliveryAddressRepository.createDeliveryAddress(user, deliveryAddressDto)
    }

    setStudioAddress= async (user: AuthEntity): Promise<DefaultStudioEntity[]> => {
        return await this.defaultStudioRepository.setStudioAddresses(user)
    }

    getAddresses = async(user: AuthEntity): Promise<DeliveryAddressEntity[]> => {
        return await this.deliveryAddressRepository.getAddresses(user)
    }

    getStudioAddresses = async(user:AuthEntity): Promise<DefaultStudioEntity[]> => {
        return await this.defaultStudioRepository.getStudioAddresses(user)
    }

    updateAddress = async (user: AuthEntity, updateAddressDto: UpdateAddressDto, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        return await this.deliveryAddressRepository.updateAddress(user, updateAddressDto, deliveryAddressId)
    }

    defaultAddress = async (user: AuthEntity, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        return await this.deliveryAddressRepository.defaultAddress(user, deliveryAddressId)
    }

    defaultStudioAddress= async (user: AuthEntity, studioId: string): Promise<DefaultStudioEntity> => {
        return await this.defaultStudioRepository.defaultStudioAddress(user, studioId)
    }

    getDefaultAddress = async(user: AuthEntity) : Promise<DeliveryAddressEntity> => {
        return await this.deliveryAddressRepository.getDefaultAddress(user)
    }

    getDefaultStudioAddress = async(user: AuthEntity): Promise<DefaultStudioEntity> => {
        return await this.defaultStudioRepository.getDefaultStudioAddress(user)
    }

    deleteDeliveryAddress = async(user: AuthEntity, deliveryAddressId: string): Promise<string> => {
        return await this.deliveryAddressRepository.deleteAddress(user, deliveryAddressId);
    }

}