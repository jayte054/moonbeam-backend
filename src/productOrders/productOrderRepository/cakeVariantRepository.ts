import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { CloudinaryService } from "src/cloudinary/cloudinaryService/cloudinaryService";
import { MailerService } from "src/mailerModule/mailerService";
import { VariantCakeObject } from 'src/types';
import { DataSource, FindOneOptions, Repository } from "typeorm";
import {v4 as uuid} from "uuid";
import { CartDto, FoilCakeDto } from "../productOrderDto/productOrderDto";
import { CakeVariantEntity } from "../productOrderEntity/cakeVariantEntity";
import { OrderStatus, ProductFlavours, VariantType } from "../ProductOrderEnum/productOrderEnum";
import { fetchBudgetCakeRate, fetchRate } from "../productUtility";
import { CartRepository } from "./cartRepository";

@Injectable()
export class CakeVariantRepository extends Repository<CakeVariantEntity> {
  private logger = new Logger('CakeVariantRepository');
  constructor(
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService,
    private readonly mailerService: MailerService,
    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) {
    super(CakeVariantEntity, dataSource.createEntityManager());
  }

  async foilCakeOrder(
    foilCakeDto: FoilCakeDto,
    user: AuthEntity,
  ): Promise<VariantCakeObject> {
    const { orderName, quantity, description, deliveryDate, productFlavour } =
      foilCakeDto;

    const foilCakeOrder = new CakeVariantEntity();

    const rate = await fetchBudgetCakeRate();

    const { foilCakeRate } = rate[0];

    foilCakeOrder.variantId = uuid();
    foilCakeOrder.orderName = orderName;
    foilCakeOrder.quantity = quantity;
    foilCakeOrder.type = VariantType.foilCake;
    foilCakeOrder.description = description;
    foilCakeOrder.productFlavour = productFlavour;

    const price = Number(quantity) * foilCakeRate;

    foilCakeOrder.price = price.toString();
    foilCakeOrder.deliveryDate = deliveryDate;
    foilCakeOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    foilCakeOrder.status = OrderStatus.progress;
    foilCakeOrder.user = user;

    console.log(foilCakeOrder);
    const email = user.email;
    const cartDto: CartDto = {
      itemName: foilCakeOrder.orderName,
      price: foilCakeOrder.price,
      quantity: foilCakeOrder.quantity,
      productOrderId: foilCakeOrder.variantId,
      itemType: foilCakeOrder.type,
      deliveryDate: foilCakeOrder.deliveryDate,
    };

    try {
      await foilCakeOrder.save();
      await this.cartRepository.addToCart(user, cartDto);
      // await this.mailerService.foilCakeOrderMail(email, foilCakeOrder);
      this.logger.verbose(`foilCake order with id ${foilCakeOrder.variantId}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`error placing foilCakeOrder`);
      throw new InternalServerErrorException();
    }

    return {
      variantId: foilCakeOrder.variantId,
      orderName: foilCakeOrder.orderName,
      type: foilCakeOrder.type,
      quantity: foilCakeOrder.quantity,
      productFlaovur: foilCakeOrder.productFlavour,
      price: foilCakeOrder.price,
      description: foilCakeOrder.description,
      deliveryDate: foilCakeOrder.deliveryDate,
      userId: foilCakeOrder.user.id,
    };
  }

  async cakeParfaitOrder(
    foilCakeDto: FoilCakeDto,
    user: AuthEntity,
  ): Promise<VariantCakeObject> {
    const { orderName, quantity, description, deliveryDate } = foilCakeDto;

    const parfaitOrder = new CakeVariantEntity();

    const rate = await fetchBudgetCakeRate();

    const { cakeParfaitRate } = rate[0];

    parfaitOrder.variantId = uuid();
    parfaitOrder.orderName = orderName;
    parfaitOrder.quantity = quantity;
    parfaitOrder.type = VariantType.cakeParfait;
    parfaitOrder.description = description;

    const price = Number(quantity) * cakeParfaitRate;

    parfaitOrder.price = price.toString();
    parfaitOrder.deliveryDate = deliveryDate;
    parfaitOrder.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    parfaitOrder.status = OrderStatus.progress;
    parfaitOrder.user = user;

    console.log(parfaitOrder);
    const email = user.email;
    const cartDto: CartDto = {
      itemName: parfaitOrder.orderName,
      price: parfaitOrder.price,
      quantity: parfaitOrder.quantity,
      productOrderId: parfaitOrder.variantId,
      itemType: parfaitOrder.type,
      deliveryDate: parfaitOrder.deliveryDate,
    };

    try {
      await parfaitOrder.save();
      await this.cartRepository.addToCart(user, cartDto);
      await this.mailerService.cakeParfaitOrderMail(email, parfaitOrder);
      this.logger.verbose(`foilCake order with id ${parfaitOrder.variantId}`);
    } catch (error) {
      console.log(error);
      this.logger.error(`error placing parfaitOrder`);
      throw new InternalServerErrorException();
    }

    return {
      variantId: parfaitOrder.variantId,
      orderName: parfaitOrder.orderName,
      quantity: parfaitOrder.quantity,
      type: parfaitOrder.type,
      price: parfaitOrder.price,
      description: parfaitOrder.description,
      deliveryDate: parfaitOrder.deliveryDate,
      userId: parfaitOrder.user.id,
    };
  }

  async getCakeVariantOrders(user: AuthEntity): Promise<CakeVariantEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', { userId: user.id });

    try {
      const orders = await query.getMany();

      if (!orders) {
        this.logger.error('Chops Orders not found');
        throw new NotFoundException('Chops Orders not found');
      }

      this.logger.verbose(
        `cake variants for user ${user.id} fetched successfully`,
      );
      return orders;
    } catch (error) {
      console.log(error);
      this.logger.error(`error fetching variant cakes for user ${user.id}`);
      throw new InternalServerErrorException(`error fetching cakes`);
    }
  }

  async getOrderWithId(
    variantId: string,
    user: AuthEntity,
  ): Promise<CakeVariantEntity | any> {
    const orderWithId = await this.findOne({
      where: {
        variantId,
        userId: user.id,
      },
    });

    if (!orderWithId) {
      throw new NotFoundException(`order with id ${variantId} not found`);
    }
    try {
      this.logger.verbose(
        `user ${user.firstname} successfully fetched order with id ${variantId}`,
      );
      return orderWithId;
    } catch (error) {
      this.logger.error(
        `User with ${user.firstname} failed to get order with id ${variantId}`,
      );
      throw new InternalServerErrorException(
        `failed to get order with id ${variantId}`,
      );
    }
  }
}