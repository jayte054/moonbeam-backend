import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Request } from 'express';
import { AdminAuthEntity } from "src/authModule/adminAuthEntity/adminAuthEntity";
import { CloudinaryService } from "src/cloudinary/cloudinaryService/cloudinaryService";
import { DataSource, FindOneOptions, Repository } from "typeorm";
import { UpdateRtgProductDto, UploadRtgProductDto } from "../adminHubDto/adminHubDto";
import { ReadyToGoProductsEntity } from "../rtgProductsEntity/rtgProductsEntity";
import { rtgProductObject } from "../types";

@Injectable()
export class ReadyToGoProductsRepository extends Repository<ReadyToGoProductsEntity> {
  private logger = new Logger('ReadyToGoProductsRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ReadyToGoProductsEntity, dataSource.createEntityManager());
  }

  uploadRtgProduct = async (
    admin: AdminAuthEntity,
    req: Request,
    uploadRtgProductDto: UploadRtgProductDto,
  ): Promise<rtgProductObject> => {
    const { rtgName, rtgType, rtgPrice, rtgDescription } = uploadRtgProductDto;

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);

    const newRtgProduct = new ReadyToGoProductsEntity();

    newRtgProduct.rtgName = rtgName;
    newRtgProduct.rtgType = rtgType;
    newRtgProduct.rtgPrice = rtgPrice;
    newRtgProduct.rtgDescription = rtgDescription;
    newRtgProduct.rtgImageUrl = cloudinaryUrl.secure_url;
    newRtgProduct.date = new Date().toLocaleDateString('en-us', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    newRtgProduct.admin = admin;

    try {
      await newRtgProduct.save();
      this.logger.verbose(
        `successfully saved new ready to go product with id ${newRtgProduct.rtgId}`,
      );
      return {
        rtgId: newRtgProduct.rtgId,
        rtgName: newRtgProduct.rtgName,
        rtgType: newRtgProduct.rtgType,
        rtgPrice: newRtgProduct.rtgPrice,
        rtgImageUrl: newRtgProduct.rtgImageUrl,
        rtgDescription: newRtgProduct.rtgDescription,
        date: newRtgProduct.date,
        adminId: admin.id,
      };
    } catch (error) {
        console.log(error)
      this.logger.error(`failed to upload ready to go products`);
      throw new InternalServerErrorException(`failed to upload new product`);
    }
  };

  getRtgProductsAuth = async (
    admin: AdminAuthEntity,
  ): Promise<ReadyToGoProductsEntity[]> => {
    const options: FindOneOptions<ReadyToGoProductsEntity> = {};

    const rtgProducts = await this.find(options);

    if (!rtgProducts) {
      this.logger.error('there are no ready to go products to fetch');
      throw new NotFoundException('products not found');
    }
    if (admin.isAdmin === true) {
      this.logger.verbose(`ready to go products fetched successfully`);
      return rtgProducts;
    }
  };

  getRtgProducts = async (): Promise<ReadyToGoProductsEntity[]> => {
    const options: FindOneOptions<ReadyToGoProductsEntity> = {};

    const rtgProducts = await this.find(options);

    if (!rtgProducts) {
      this.logger.error('there are no ready to go products to fetch');
      throw new NotFoundException('products not found');
    } else {
      this.logger.verbose(`ready to go products fetched successfully`);
      return rtgProducts;
    }
  };

  getRtgProductsWithId = async (admin: AdminAuthEntity, rtgId: string): Promise<ReadyToGoProductsEntity> => {
    try {
        const rtgProduct = await this.findOne({
            where: {
                rtgId,
                adminId: admin.id,
            }
        })

        if(!rtgProduct) {
            this.logger.error(`product with id ${rtgId} not found`);
            throw new NotFoundException(`product not found`)
        }

        this.logger.verbose(`product with id ${rtgId} successfully fetched`)
        return rtgProduct;
    } catch (error) {
      this.logger.error(`failed to fetch product with id ${rtgId}`);
      throw new InternalServerErrorException();
    }
  }

  updateRtgProduct = async (
    admin: AdminAuthEntity, 
    rtgId: string, 
    req: Request, 
    updateRtgProductDto: UpdateRtgProductDto
    ): Promise<ReadyToGoProductsEntity> => {
    const {
        rtgName, 
        rtgType, 
        rtgPrice, 
        file, 
        rtgDescription
    } = updateRtgProductDto;

    const rtgProduct = await this.getRtgProductsWithId(admin, rtgId);

    if (file) {
        const newImage = await this.cloudinaryService.uploadImage(req.file);

        if(rtgProduct.rtgImageUrl) {
            const oldPublicId = this.extractPublicId(rtgProduct.rtgImageUrl);
            await this.cloudinaryService.deleteImage(oldPublicId)
        }
        rtgProduct.rtgImageUrl = newImage.secure_url;
    }
    rtgProduct.rtgName = rtgName || rtgProduct.rtgName;
    rtgProduct.rtgType = rtgType || rtgProduct.rtgType;
    rtgProduct.rtgPrice = rtgPrice || rtgProduct.rtgPrice;
    rtgProduct.rtgDescription = rtgDescription || rtgProduct.rtgDescription;

    try {
        await rtgProduct.save();
        this.logger.verbose(`"ready to go product" with id ${rtgId} successfully updated`)
        return rtgProduct;
    } catch (error) {
        this.logger.error(`failed to update "ready to go product" with id ${rtgId}`)
        throw new InternalServerErrorException("failed to update product")
    }

  }

  private extractPublicId(rtgImageUrl: string): string {
    const parts = rtgImageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId
  }

  deleteRtgProduct = async (admin: AdminAuthEntity, rtgId: string): Promise<string> => {
    try {
        const product = await this.delete({
            rtgId,
            adminId: admin.id
        })

        if(!product) {
            this.logger.error(`product with id ${rtgId} not found`)
            throw new NotFoundException(`product not found`)
        }

        this.logger.verbose(`"ready to go product" with id ${rtgId}`)
        return `product with id ${rtgId} successfully deleted`

    }catch (error) {
        this.logger.error(`failed to delete product with id ${rtgId}`)
        throw new InternalServerErrorException("failed to delete product")
    }
  }
}