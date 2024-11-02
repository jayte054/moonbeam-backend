import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { CloudinaryService } from 'src/cloudinary/cloudinaryService/cloudinaryService';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { UpdateProductDto, UploadProductDto } from '../adminHubDto/adminHubDto';
import { ProductEntity } from '../productGalleryEntity/productGalleryEntity';

@Injectable()
export class AdminProductGalleryRepository extends Repository<ProductEntity> {
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
        `product with id ${product.productId} saved successfully `,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(`error uploading product`);
      throw new InternalServerErrorException(' error uploading product');
    }

    return {
      productId: product.productId,
      type: product.type,
      imageUrl: product.imageUrl,
      description: product.description,
      date: product.date,
      adminId: product.admin.id,
    };
  };

  getProducts = async (admin: AdminAuthEntity): Promise<ProductEntity[]> => {
    const options: FindOneOptions<ProductEntity> = {};

    const products: any = await this.find(options);
    if (!products) {
      this.logger.error('products not found');
      throw new NotFoundException('products not found');
    }
    if (admin.isAdmin === true) {
      this.logger.verbose(`products fetched successfully by admin ${admin.id}`);
      return products;
    }
  };

  getProductsGallery = async (): Promise<ProductEntity[]> => {
    const options: FindOneOptions<ProductEntity> = {};

    const products = await this.find(options);
    if (!products) {
      this.logger.error('products not found');
      throw new NotFoundException('products not found');
    } else {
      this.logger.verbose(`products fetched successfully`);
      return products;
    }
  };

  getProductsWithId = async (
    productId: string,
    admin: AdminAuthEntity,
  ): Promise<ProductEntity | any> => {
    const productWithId = await this.findOne({
      where: {
        productId,
        adminId: admin.id,
      },
    });

    if (!productWithId) {
      throw new NotFoundException(`product with id ${productId} not found`);
    }

    try {
      this.logger.verbose(`product with id ${productId} fetched successfully`);
      return productWithId;
    } catch (error) {
      this.logger.error(`product with id ${productId} fetched unsuccessfully`);
      throw new NotFoundException('product not found');
    }
  };

  updateProduct = async (
    productId: string,
    admin: AdminAuthEntity,
    req: Request,
    file: Express.Multer.File,
    updateProductDto?: UpdateProductDto,
  ): Promise<ProductEntity> => {
    console.log(updateProductDto);
    const { type, description } = updateProductDto;

    const product = await this.getProductsWithId(productId, admin);

    if (file) {
      const newImage = await this.cloudinaryService.uploadImage(req.file);

      if (product.imageUrl) {
        const oldPublicId = this.extractPublicId(product.imageUrl);
        await this.cloudinaryService.deleteImage(oldPublicId);
      }
      product.imageUrl = newImage.secure_url;
    }
    product.type = type || product.type;
    product.description = description || product.description;

    try {
      await product.save();
      this.logger.verbose(
        `Product with id ${productId} has been successfully updated by admin ${product.adminId}`,
      );
    } catch (error) {
      this.logger.error(`Product with id ${productId} update was unsuccessful`);
      throw new InternalServerErrorException(
        `updating product with id ${productId} unsuccessful`,
      );
    }
    return product;
  };

  private extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  }

  deleteProduct = async (
    admin: AdminAuthEntity,
    productId: string,
  ): Promise<string> => {
    try {
      console.log(admin)
      const product = await this.delete({
        productId,
        adminId: admin.id,
      });

      if (!product) {
        this.logger.debug(`product with id ${productId} not found`);
        throw new NotFoundException(`product with id ${productId} not found`);
      }
      this.logger.verbose(`product with id ${productId} successfully deleted`);
      return `product with id ${productId} successfully deleted`;
    } catch (error) {
      console.log(error)
      this.logger.error(`failed to delete item with id ${productId}`);
      throw new InternalServerErrorException('failed to delete item');
    }
  };
}
