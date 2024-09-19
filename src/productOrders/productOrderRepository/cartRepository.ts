import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { async } from "rxjs";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { CartObject } from "src/types";
import { DataSource, Repository } from "typeorm";
import { CartDto } from "../productOrderDto/productOrderDto";
import { CartEntity } from "../productOrderEntity/cartEntity";

@Injectable()
export class CartRepository extends Repository<CartEntity> {
    private logger = new Logger('CartRepository')
    constructor(
        private dataSource: DataSource
    ){super(CartEntity, dataSource.createEntityManager())}

     addToCart = async (user: AuthEntity, cartDto: CartDto): Promise<CartObject> => {
        const {itemName, price, imageUrl, quantity, productOrderId, itemType} = cartDto;

        const cartItem = new CartEntity()
        cartItem.itemName = itemName;
        cartItem.price = price;
        cartItem.imageUrl = imageUrl;
        cartItem.quantity = quantity || "1";
        cartItem.productOrderId = productOrderId;
        cartItem.itemType = itemType;
        cartItem.user = user;

        try{
            await cartItem.save();
            this.logger.verbose(`cart item with id ${cartItem.itemId} saved successfully`)
            return {
                itemName: cartItem.itemName,
                price: cartItem.price,
                imageUrl: cartItem.imageUrl,
                quantity: cartItem.quantity,
                productOrderId: cartItem.productOrderId,
                userId: cartItem.user.id
            }
        } catch (error) {
            console.log(error)
            this.logger.error(`error saving item by user ${user.id} to cart`)
            throw new InternalServerErrorException(`error saving item to cart`)
        }

    }

        fetchCartItems = async(user: AuthEntity): Promise<CartEntity[]> =>{
            const query = this.createQueryBuilder('itemName');
                    query.where('itemName.userId = :userId', {userId: user.id})


            try{
            const items = await query.getMany();
                if(!items) {
                    this.logger.debug('cart has no items')
                    throw new NotFoundException('empty cart')
                }
                this.logger.verbose(`cart items for user ${user.id} successfully fetched`)
                return items;
            } catch (error) {
                this.logger.error(`failed to fetch items by user ${user.id}`)
                throw new InternalServerErrorException(`failed to fetch items`)
            }
        }

        deleteCartItem = async (user: AuthEntity, itemId: string) : Promise<string> => {
            try{
                const item = await this.delete({
                    itemId,
                    userId: user.id
                })

                if(!item) {
                    this.logger.debug(`cart with id ${itemId} not found`)
                    throw new NotFoundException(`cart with id ${itemId} not found`)
                }
                return (`cart item with id ${itemId} successfully deleted`)
            }catch (error) {
                this.logger.error(`failed to delete item with id ${itemId}`)
                throw new InternalServerErrorException("failed to delete item")
            }
        }

}