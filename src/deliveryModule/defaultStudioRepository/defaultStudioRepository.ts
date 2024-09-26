import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
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

    try {
      const addresses = await fetchStudioAddresses();
      if (!addresses) {
        this.logger.error('addresses not found');
        throw new NotFoundException(' addresses not found');
      }
      const studioAddresses: DefaultStudioEntity[] = await Promise.all(
        addresses.map(async (address) => {
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

    if (!newDefault) {
      this.logger.error(`new default address not found`);
      throw new InternalServerErrorException('New default address not found');
    }

    newDefault.defaultStudioAddress = true;

    try {
      await newDefault.save();
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


      if (!address) {
        throw new NotFoundException('default address not found');
      }
      this.logger.verbose(
        `default address for user ${user.id} successfully fetched`,
      );
      return address;
    } catch (error) {
      this.logger.error('address with default status not found');
      throw new InternalServerErrorException('address not found');
    }
  };
}