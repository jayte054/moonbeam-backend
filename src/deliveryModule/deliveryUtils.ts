import { Logger, NotFoundException } from "@nestjs/common"
import { AdminStudioEntity } from "src/adminHubModule/adminStudioDetailsEntity/adminStudioDetailsEntity"
import { FindOneOptions } from "typeorm"

const logger = new Logger("deliveryUtility")
export const fetchStudioAddresses= async () => {

    const options: FindOneOptions<AdminStudioEntity> = {}

    const studios = await AdminStudioEntity.find(options);
    if (!studios) {
       logger.error("studios not found")
       throw new NotFoundException("studios not found")
    }

    logger.verbose("studios fetched successfuly")
    return studios
}