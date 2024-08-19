import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { CloudinaryService } from "src/cloudinary/cloudinaryService/cloudinaryService";
import { MailerService } from "src/mailerModule/mailerService";
import { chopsOrderType } from "src/types";
import { DataSource, Repository } from "typeorm";
import { CreateChopsOrderDto, UpdateCustomChopOrderDto } from "../productOrderDto/productOrderDto";
import { CustomChopsOrderEntity } from "../productOrderEntity/customChopsEntity";
import { OrderStatus } from "../ProductOrderEnum/productOrderEnum";

@Injectable()
export class CustomChopsRepository extends Repository<CustomChopsOrderEntity> {
  private logger = new Logger('CustomChopsRepository');
  constructor(
    private dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {
    super(CustomChopsOrderEntity, dataSource.createEntityManager());
  }

  async customChopsOrder(
    createChopsOrderDto: CreateChopsOrderDto,
    user: AuthEntity,
  ): Promise<chopsOrderType> {
    const {orderName, chopType, numberOfPacks, deliveryDate, description} = createChopsOrderDto;

    const order = new CustomChopsOrderEntity()

    order.orderName = orderName;
    order.chopType = chopType;
    order.numberOfPacks = numberOfPacks;
    order.orderDate = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    order.deliveryDate = deliveryDate;
    order.description = description;
    order.status = OrderStatus.progress;
    order.user = user;

    try{
      await order.save();
      await this.mailerService.customChopsOrderMail(user.email, order)
      this.logger.verbose(
        `custom order with id ${order.chopsId} has been successfully created `,
      );
      return {
        orderName: order.orderName,
        chopType: order.chopType,
        numberOfPacks: order.numberOfPacks,
        deliveryDate: order.deliveryDate,
        description: order.description,
      };
    } catch (error) {
        console.log(error)
        this.logger.error(`failed to create custom chop order`);
        throw new InternalServerErrorException(`failed to create custom chop order`)
    }
  }

  async getCustomChopsOrder(user: AuthEntity): Promise<CustomChopsOrderEntity[]> {
    const query = this.createQueryBuilder('orderName');
    query.where('orderName.userId = :userId', {userId: user.id});

    const orders = await query.getMany()

    try{
        this.logger.verbose('successfully fetched custom chop orders');
        return orders;
    } catch (error) {
        console.log(error)
        this.logger.error('failed to fetch custom chop orders')
        throw new InternalServerErrorException(`failed to fetch custom chop orders`)
    }
  }

  async getCustomChopOrderWithId(chopsId: string, user: AuthEntity): Promise<CustomChopsOrderEntity> {
    const orderWithId = this.findOne({
        where: {
            chopsId,
            userId: user.id
        }
    })

    if (!orderWithId) {
        throw new NotFoundException(`order with id ${orderWithId} not found`)
    }
    try {
        this.logger.verbose(`order with id ${chopsId} successfully fetched`)
        return orderWithId;
    } catch (error) {
        this.logger.error(`failed to fetch order with id ${chopsId}`)
        throw new InternalServerErrorException(`failed to fetch custom chop order with id ${chopsId}`)
    }
  }

  async updateCustomChopOrder(updateCustomChopOrder: UpdateCustomChopOrderDto, user: AuthEntity, chopsId: string): Promise<CustomChopsOrderEntity> {
    const {orderName, chopType, numberOfPacks, deliveryDate, description, status} = updateCustomChopOrder;

    const order = await this.getCustomChopOrderWithId(chopsId, user);

    order.orderName = orderName || order.orderName;
    order.chopType = chopType || order.chopType;
    order.numberOfPacks = numberOfPacks || order.numberOfPacks;
    order.deliveryDate = deliveryDate || order.deliveryDate;
    order.description = description || order.description;
    order.status = status || order.status;

    try {
        await order.save();
        this.logger.verbose(`successfully fetched custom chop order with id ${chopsId}`)
        return order;
    } catch (error) {
        this.logger.error(`failed to update order with id ${chopsId}`)
        throw new InternalServerErrorException(`failed to update order with id ${chopsId}`)
    }
  }
}