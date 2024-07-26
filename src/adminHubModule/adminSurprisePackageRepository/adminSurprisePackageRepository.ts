import {
    Injectable, 
    Logger,
    InternalServerErrorException,
} from "@nestjs/common";
import {Repository, DataSource} from "typeorm";
import {SurprisePackageEntity} from "../surprisePackageEntity/surprisePackageEntity"
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import {SurprisePackageDto} from "../adminHubDto/adminHubDto"
import {SurprisePackageObject} from "../types";


@Injectable()
export class SurprisePackageRepository extends Repository<SurprisePackageEntity> {
    private logger = new Logger("SurprisePackageRepository")
    constructor(
        private dataSource: DataSource,
        private cloudinaryService: CloudinaryService,
    ) {
        super(SurprisePackageEntity, dataSource.createEntityManager());
    }

    //=======Surprise package rates=========//

    surprisePackage = async(
        admin: AdminAuthEntity,
        surprisePackageDto: SurprisePackageDto,
    ): Promise<SurprisePackageObject> => {
        const {
            packageName,
            itemOne,
            itemTwo,
            itemThree,
            itemFour,
            itemFive,
            itemSix,
            itemSeven,
            itemEight,
            itemNine,
            itemTen,
            itemEleven,
            itemTwelve,
            price,
            description,
        } = surprisePackageDto;

        const surprisePackage= new SurprisePackageEntity();

        surprisePackage.packageName = packageName;
        surprisePackage.itemOne = itemOne;
        surprisePackage.itemTwo = itemTwo;
        surprisePackage.itemThree = itemThree;
        surprisePackage.itemFour = itemFour;
        surprisePackage.itemFive = itemFive;
        surprisePackage.itemSix = itemSix;
        surprisePackage.itemSeven = itemSeven;
        surprisePackage.itemEight = itemEight;
        surprisePackage.itemNine = itemNine;
        surprisePackage.itemTen = itemTen;
        surprisePackage.itemEleven = itemEleven;
        surprisePackage.itemTwelve = itemTwelve;
        surprisePackage.price = price;
        surprisePackage.description = description;
        surprisePackage.date = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        });
        surprisePackage.admin = admin

        try{
            if(admin.isAdmin === true) {
                await surprisePackage.save()
                this.logger.verbose(`
                    new package with package name ${surprisePackage.packageName} has been successfully created
                `)
                return {
                    packageName: surprisePackage.packageName,
                    itemOne: surprisePackage.itemOne,
                    itemTwo: surprisePackage.itemTwo,
                    itemThree: surprisePackage.itemThree,
                    itemFour: surprisePackage.itemFour,
                    itemFive: surprisePackage.itemFive,
                    itemSix: surprisePackage.itemSix,
                    itemSeven: surprisePackage.itemSeven,
                    itemEight: surprisePackage.itemEight,
                    itemNine: surprisePackage.itemNine,
                    itemTen: surprisePackage.itemTen,
                    itemEleven: surprisePackage.itemEleven,
                    itemTwelve: surprisePackage.itemTwelve,
                    price: surprisePackage.price,
                    description: surprisePackage.description,
                    date: surprisePackage.date,
                    adminId: admin.id
                }
            }
        }catch(error){
            this.logger.error("error saving package")
            throw new InternalServerErrorException()
        }
    }
}