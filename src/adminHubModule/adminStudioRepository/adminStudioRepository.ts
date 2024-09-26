import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { async } from "rxjs";
import { AdminAuthEntity } from "src/authModule/adminAuthEntity/adminAuthEntity";
import { DataSource, FindOneOptions, Repository } from "typeorm";
import { AdminStudioDetailsDto, UpdateStudioDetailsDto } from "../adminHubDto/adminHubDto";
import { AdminStudioEntity } from "../adminStudioDetailsEntity/adminStudioDetailsEntity";
import { StudioObject } from "../types";

@Injectable()
export class AdminStudioDetailsRepository extends Repository<AdminStudioEntity> {
    private logger = new Logger("adminStudioDetailsRepository")
    constructor(
        dataSource: DataSource
    ){ 
        super(AdminStudioEntity, dataSource.createEntityManager())
    }

    createStudioDetails = async (
        admin: AdminAuthEntity, 
        adminStudioDetailsDto: AdminStudioDetailsDto): Promise<StudioObject> => {
        
        if (!admin.isAdmin) {
            this.logger.error("admin permission required")
            throw new InternalServerErrorException("admin permission required")
        }

        const {
            studioAddress, 
            LGA, 
            state, 
            phoneNumber, 
            deliveryBaseFee, 
            deliveryPricePerKm
        } = adminStudioDetailsDto;

        const studio= new AdminStudioEntity()

        studio.studioAddress = studioAddress;
        studio.LGA = LGA;
        studio.state = state;
        studio.phoneNumber = phoneNumber;
        studio.deliveryBaseFee = deliveryBaseFee;
        studio.deliveryPricePerKm = deliveryPricePerKm;
        studio.admin = admin

        try {
            await studio.save()
            this.logger.verbose(`studio with id ${studio.studioId} has bee successfully created`)
            return {
              studioAddress: studio.studioAddress,
              LGA: studio.LGA,
              state: studio.state,
              phoneNumber: studio.phoneNumber,
              deliveryBaseFee: studio.deliveryBaseFee,
              deliveryPricePerKm:studio.deliveryPricePerKm,
              adminId: admin.id,
            };
        } catch (error) {
            this.logger.error(`error creating new studio`)
            throw new InternalServerErrorException("error creating new studio")
        }
    }

    getStudios = async (): Promise<AdminStudioEntity[]> => {
        const options: FindOneOptions<AdminStudioEntity> = {};

        const studios = await this.find(options);
        if (!studios) {
            this.logger.error(" studios not found")
            throw new NotFoundException(" studios not found")
        }

        this.logger.verbose(" studios fetched successfully")
        return studios;
    }

    getStudioWithId = async(studioId: string): Promise<AdminStudioEntity | any> => {
        const studio = await this.findOne({
            where: {studioId}
        })

        if(!studio) {
            this.logger.debug(`studio with id ${studioId} not found`)
            throw new NotFoundException("studio not found")
        }

        try {
            this.logger.verbose(`studio with id ${studioId} successfully fetched`)
            return studio
        } catch (error) {
            this.logger.error(`failed to fetch studio with id ${studioId}`)
            throw new InternalServerErrorException('studio not found');
        }
    }

    updateStudioDetails = async(
        admin: AdminAuthEntity, 
        studioId: string,
        updateStudioDetailsDto: UpdateStudioDetailsDto
        ): Promise<AdminStudioEntity> => {
            if (admin.isAdmin !== true) {
                this.logger.debug('admin permission required')
                throw new InternalServerErrorException("user is not an admin")
            }
            const {
                studioAddress, 
                LGA, 
                state, 
                phoneNumber, 
                deliveryBaseFee, 
                deliveryPricePerKm
            } = updateStudioDetailsDto;

            const studio = await this.getStudioWithId(studioId)

            if (!studio) {
                this.logger.debug(`studio with Id ${studioId} not found`)
                throw new NotFoundException('studio not found')
            }

            if (admin.id !== studio.adminId) {
                this.logger.debug(`studio details cannot be updated by wrong ${admin.id}`)
                throw new InternalServerErrorException(" Wrong Admin")
            }

            studio.studioAddress = studioAddress;
            studio.LGA = LGA;
            studio.state = state;
            studio.phoneNumber = phoneNumber;
            studio.deliveryBaseFee = deliveryBaseFee;
            studio.deliveryPricePerKm = deliveryPricePerKm;

            try {
                await studio.save()
                this.logger.verbose(`studio with id ${studioId} updated successfully`)
                return studio
            } catch (error) {
                this.logger.error("error updating studio")
                throw new InternalServerErrorException("error updating studio")
            }
    }
}