import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { CloudinaryService } from "src/cloudinary/cloudinaryService/cloudinaryService";
import { MailerService } from "src/mailerModule/mailerService";
import { RtgOrderObject } from "src/types";
import { DataSource, Repository } from "typeorm";
import { CartDto, RtgOrderDto } from "../productOrderDto/productOrderDto";
import { OrderStatus } from "../ProductOrderEnum/productOrderEnum";
import { RtgOrderEntity } from "../rtgOrderEntity/rtgOrderEntity";
import { CartRepository } from "./cartRepository";

@Injectable()
export class RtgOrderRepository extends Repository<RtgOrderEntity> {
    private logger = new Logger("RtgOrderRepository")
    constructor(
        private dataSource: DataSource,
        private cloudinaryService: CloudinaryService,
        private readonly mailerService: MailerService,
        @InjectRepository(CartRepository)
        private cartRepository: CartRepository
    ) {
        super(RtgOrderEntity, dataSource.createEntityManager())
    }
    
    createRtgOrder = async (
        user: AuthEntity, 
        rtgOrderDto: RtgOrderDto, 
        ): Promise<RtgOrderObject> => {
            const {
                orderName, 
                orderType, 
                cakeMessage, 
                deliveryDate, 
                price,
                imageUrl,
            } = rtgOrderDto;


        const order = new RtgOrderEntity();

        order.orderName = orderName;
        order.orderType = orderType;
        order.cakeMessage = cakeMessage;
        order.deliveryDate = deliveryDate;
        order.price = price;
        order.status = OrderStatus.progress;
        order.imageUrl = imageUrl;
        order.orderDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        });
        order.user = user;

        try {
            await order.save();
            const cartDto: CartDto = {
                itemName: order.orderName,
                price: order.price,
                imageUrl: order.imageUrl,
                productOrderId: order.rtgOrderId,
                itemType: order.orderType,
                deliveryDate: order.deliveryDate
            } 
            await this.cartRepository.addToCart(user, cartDto)
            await this.mailerService.rtgOrderMail(user.email, order)
            this.logger.verbose(
                `user ${user.id} has successfully placed an rtg order`
            )
            return {
              rtgOrderId: order.rtgOrderId,
              orderName: order.orderName,
              orderType: order.orderType,
              cakeMessage: order.cakeMessage,
              status: order.status,
              orderDate: order.orderDate,
              deliveryDate: order.deliveryDate,
              price: order.price,
              userId: user.id,
            };
        } catch (error) {
            this.logger.error(`failed to place rtg order by user ${user.id}`)
            throw new InternalServerErrorException("failed to place ready to go order")
        }
    }
}