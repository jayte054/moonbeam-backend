import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { DefaultStudioAddressObject } from "src/types";
import { DataSource, Repository } from "typeorm";
import { DefaultStudioEntity } from "../defaultStudioAddressEntity/defaultStudioAddressEntity";
import { DefaultAddressDto } from "../deliveryDto/deliveryAddressDto";
import { fetchStudioAddresses } from "../deliveryUtils";

@Injectable()
export class DefaultStudioRepository extends Repository<DefaultStudioEntity> {
  private logger = new Logger('defaultStudioRepository');
  constructor(private dataSource: DataSource) {
    super(DefaultStudioEntity, dataSource.createEntityManager());
  }

  setStudioAddresses = async (
    user: AuthEntity,
  ): Promise<DefaultStudioEntity[]> => {
    if (!user) {
      this.logger.error('user not authorised');
      throw new InternalServerErrorException('user not Authorized');
    }
    const addressArray: DefaultStudioEntity[] | any = [];

     const removeDuplicateAddresses = (addresses: DefaultStudioEntity[]) => {
       const uniqueAddresses = addresses.filter(
         (address, index, self) =>
           index ===
           self.findIndex(
             (a) =>
               a.studioAddress === address.studioAddress &&
               a.studioTitle === address.studioTitle,
           ),
       );
       console.log("unique", uniqueAddresses)
       return uniqueAddresses;
     };

   
    try {
      const savedAddresses: DefaultStudioEntity[] =
        await this.getStudioAddresses(user);
      const newAddresses = await fetchStudioAddresses();
        addressArray.push(...newAddresses, ...savedAddresses);

        const addresses = removeDuplicateAddresses(addressArray);

        if (addresses.length === 0) {
            this.logger.error('addresses not found');
            throw new NotFoundException(' addresses not found');
            }

            await DefaultStudioEntity.delete({
              user: { id: user.id },
            });


      const studioAddresses: DefaultStudioEntity[] = await Promise.all(
        addresses.map(async (address: DefaultStudioAddressObject) => {
          const newAddress = new DefaultStudioEntity();
          newAddress.studioTitle = address.studioTitle;
          newAddress.studioAddress = address.studioAddress;
          newAddress.LGA = address.LGA;
          newAddress.state = address.state;
          newAddress.phoneNumber = address.phoneNumber;
          newAddress.deliveryBaseFee = address.deliveryBaseFee;
          newAddress.deliveryPricePerKm = address.deliveryPricePerKm;
          newAddress.defaultStudioAddress = address.defaultStudioAddress;
          newAddress.user = user;
          await newAddress.save();
          return newAddress; // Return the saved entity
        }),
      );
      this.logger.verbose(
        `studio addresses saved successfully for user ${user.id}`,
      );
      return studioAddresses;
    } catch (error) {
      this.logger.error(' failed to fetch studios ');
      throw new InternalServerErrorException('failed to set studios');
    }
  };

   getStudioAddresses = async (user: AuthEntity): Promise<DefaultStudioEntity[]> => {
    const query = this.createQueryBuilder('studioAddress')
    query.where('studioAddress.userId = :userId', {userId : user.id})

    try{
        const addresses = await query.getMany()
        if(!addresses) {
            this.logger.debug('no address stored yet')
                throw new NotFoundException("no address found")
        }
        console.log(addresses)
            this.logger.verbose(`succesfully fetched address from user ${user.id}`)
            return addresses
        } catch (error) {
            this.logger.error(`error fetching addresses for user ${user.id}`)
            throw new InternalServerErrorException("error fetching addresses")
        }
    }
  

  getStudioAddressWithId = async (
    user: AuthEntity,
    studioId: string,
  ): Promise<DefaultStudioEntity> => {
    const address = await this.findOne({
      where: {
        studioId,
        userId: user.id,
      },
    });

    if (!address) {
      this.logger.error(`address with id ${studioId} not found`);
      throw new NotFoundException(`address not found`);
    }
    try {
      this.logger.verbose(`successfully fetched address with id ${studioId}`);
      return address;
    } catch (error) {
      this.logger.error(`failed to fetch  address with id ${studioId}`);
      throw new InternalServerErrorException('address not found');
    }
  };

  defaultStudioAddress = async (
    user: AuthEntity,
    studioId: string,
  ): Promise<DefaultStudioEntity> => {
    const _defaultAddress = await this.findOne({
      where: {
        defaultStudioAddress: true,
        userId: user.id,
      },
    });

    if (_defaultAddress) {
      _defaultAddress.defaultStudioAddress = false;
      await _defaultAddress.save();
    }

    const newDefault = await this.getStudioAddressWithId(user, studioId);
    
    console.log(newDefault)

    if (!newDefault) {
      this.logger.error(`new default address not found`);
      throw new InternalServerErrorException('New default address not found');
    }

    newDefault.defaultStudioAddress = true;

    try {
      await newDefault.save();
      console.log(newDefault)
      this.logger.verbose(`successflly updated default address`);
      return newDefault;
    } catch (error) {
      this.logger.error(`failed to update default address`);
      throw new InternalServerErrorException(
        'failed to update default address',
      );
    }
  };

  getDefaultStudioAddress = async (
    user: AuthEntity,
  ): Promise<DefaultStudioEntity> => {
    
    try {
      const address = await this.findOne({
        where: {
          defaultStudioAddress: true,
          userId: user.id,
        },
      });
      console.log(address)

      if (!address) {
        throw new NotFoundException('default address not found');
      }
      this.logger.verbose(
        `default address for user ${user.id} successfully fetched`,
      );
      console.log(address)
      return address;
    } catch (error) {
      this.logger.error('address with default status not found');
      throw new InternalServerErrorException('address not found');
    }
  };
}