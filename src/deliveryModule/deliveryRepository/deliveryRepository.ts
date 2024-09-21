import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { DeliveryAddressObject } from "src/types";
import { DataSource, Repository } from "typeorm";
import { DeliveryAddressDto, UpdateAddressDto } from "../deliveryDto/deliveryAddressDto";
import { DeliveryAddressEntity } from "../deliveryEntity/deliveryAddressEntity";

@Injectable()
export class DeliveryAddressRepository extends Repository<DeliveryAddressEntity> {
    private logger = new Logger('DeliveryAddressRepository')
    constructor(
        private dataSource: DataSource,
    ) {
        super(DeliveryAddressEntity, dataSource.createEntityManager())
    }

    createDeliveryAddress = async(
        user: AuthEntity,
        deliveryAddressDto: DeliveryAddressDto,
    ) :Promise<DeliveryAddressObject> => {
        const {
            firstName, 
            lastName, 
            phoneNumber, 
            additionalPhoneNumber, 
            deliveryAddress, 
            region, 
            city, 
            defaultAddress } = deliveryAddressDto;

        const addressDetails = new DeliveryAddressEntity();

        addressDetails.firstName = firstName;
        addressDetails.lastName = lastName;
        addressDetails.phoneNumber = phoneNumber;
        addressDetails.additionalPhoneNumber = additionalPhoneNumber;
        addressDetails.deliveryAddress = deliveryAddress;
        addressDetails.region = region;
        addressDetails.city = city;
        addressDetails.defaultAddress = defaultAddress;
        addressDetails.user = user;

        try {
            await addressDetails.save()
            this.logger.verbose(`successfully saved address details for user ${user.id}`)
            return {
                deliveryAddressId: addressDetails.deliveryAddressId,
                firstName: addressDetails.firstName,
                lastName: addressDetails.lastName,
                phoneNumber: addressDetails.phoneNumber,
                additionalPhoneNumber: addressDetails.additionalPhoneNumber,
                deliveryAddress: addressDetails.deliveryAddress,
                region: addressDetails.region,
                city: addressDetails.city,
                defaultAddress: addressDetails.defaultAddress,
                userId: addressDetails.user.id

            }
        } catch (error) {
            this.logger.debug(`failed to create delivery address for user ${user.id}`)
            throw new InternalServerErrorException("error creating delivery address")
        }
    }

    getAddresses = async (user: AuthEntity): Promise<DeliveryAddressEntity[]> => {
        const query = this.createQueryBuilder('deliveryAddress')
        query.where('deliveryAddress.userId = :userId', {
          userId: user.id,
        });

        try {
            const address = await query.getMany()
            if(!address) {
                this.logger.debug('no address stored yet')
                throw new NotFoundException("no address found")
            }
            console.log(address)
            this.logger.verbose(`succesfully fetched address from user ${user.id}`)
            return address
        } catch (error) {
            this.logger.error(`error fetching addresses for user ${user.id}`)
            throw new InternalServerErrorException("error fetching addresses")
        }
    }

    getAddressWithId = async (user: AuthEntity, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        const address = await this.findOne({
          where:{
            deliveryAddressId,
            userId: user.id
          }  
        })

        if (!address) {
            this.logger.error(`address with id ${deliveryAddressId} not found`)
            throw new NotFoundException(`address not found`)
        }
        try {
            this.logger.verbose(`successfully fetched address with id ${deliveryAddressId}`)
            return address
        } catch(error) {
            this.logger.error(`failed to fetch  address with id ${deliveryAddressId}`)
            throw new InternalServerErrorException('address not found')
        }

    }

    updateAddress = async (
        user: AuthEntity, 
        updateAddressDto: UpdateAddressDto, 
        deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        const {
          firstName,
          lastName,
          phoneNumber,
          additionalPhoneNumber,
          deliveryAddress,
          region,
          city,
          defaultAddress,
        }= updateAddressDto;

        const address = await this.getAddressWithId(user, deliveryAddressId);

        address.firstName = firstName;
        address.lastName = lastName;
        address.phoneNumber = phoneNumber;
        address.additionalPhoneNumber = additionalPhoneNumber;
        address.deliveryAddress = deliveryAddress;
        address.region = region;
        address.city = city;
        address.defaultAddress = defaultAddress;

        try {
            await address.save();
            this.logger.verbose(`address with id ${deliveryAddressId} successfully updated`)
            return address;
        } catch (error) {
            this.logger.error(`failed to update address with id ${deliveryAddressId}`)
            throw new InternalServerErrorException("failed to update address")
        }

    }

     defaultAddress = async (user: AuthEntity, deliveryAddressId: string): Promise<DeliveryAddressEntity> => {
        const _defaultAddress = await this.findOne({
            where: {
                defaultAddress: true,
                userId: user.id
            }
        })

        if(_defaultAddress) {
            _defaultAddress.defaultAddress = false
            await _defaultAddress.save()
        }

        const newDefault = await this.getAddressWithId(user, deliveryAddressId)

        if (!newDefault) {
          this.logger.error(`new default address not found`)  
          throw new InternalServerErrorException(
            'New default address not found',
          );
        }

        newDefault.defaultAddress= true

        try {
            await newDefault.save()
            this.logger.verbose(`successflly updated default address`)
            return newDefault
        } catch(error) {
            this.logger.error(`failed to update default address`)
            throw new InternalServerErrorException("failed to update default address")
        }
    }

}