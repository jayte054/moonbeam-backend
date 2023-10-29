import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AuthEntity } from 'src/authModule/authEntity/authEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UploadProductDto } from '../adminHubDto/adminHubDto';
import { ProductEntity } from '../productEntity/productEntity';

@Injectable()
export class AdminProductRepository extends Repository<ProductEntity> {
  private logger = new Logger('AdminProductRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
  ) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  //======== Products =========

  uploadProduct = async (
    uploadProductDto: UploadProductDto,
    admin: AdminAuthEntity,
    req: Request,
  ): Promise<ProductEntity | any> => {
    const { type, description } = uploadProductDto;

    const cloudinaryUrl = await this.cloudinaryService.uploadImage(req.file);

    const product = new ProductEntity();
    // product.productId = uuid();
    product.type = type;
    product.imageUrl = cloudinaryUrl.secure_url;
    product.description = description;
    product.date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    product.admin = admin;

    try {
      await product.save();
      this.logger.verbose(
        `product with id ${product.productId} saved successfully`,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`error uploading product`);
      throw new InternalServerErrorException(' error uploading product');
    }

    return {
      id: product.productId,
      type: product.type,
      imageUrl: product.imageUrl,
      description: product.description,
      date: product.date,
      //   adminId: product.admin.id,
    };
  };

  getProducts = async (): Promise<ProductEntity[]> => {
    // const query = this.createQueryBuilder('productId');
    // query.where('productId.')
    const options: FindOneOptions<ProductEntity> = {};

    const products: any = await this.find(options);
    if (!products) {
      this.logger.error('products not found');
      throw new NotFoundException('products not found');
    }
    this.logger.verbose('products fetched successfully');
    return products;
  };

  getProductsWithId = async (
    productId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductEntity | any> => {
    const productWithId = await this.findOne({
      where: {
        productId,
        // adminId: admin.id,
      },
    });

    if (!productWithId) {
      throw new NotFoundException(`product with id ${productId} not found`);
    }

    try {
      this.logger.verbose(`product with id ${productId} fetched successfully`);
      return productWithId;
    } catch (error) {
      await this.logger.error(
        `product with id ${productId} fetched unsuccessfully`,
      );
      throw new NotFoundException('product not found');
    }
  };

  updateProduct = async () => {
    console.log('update');
  };
}
