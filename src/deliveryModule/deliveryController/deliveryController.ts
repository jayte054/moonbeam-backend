import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthEntity } from "src/authModule/authEntity/authEntity";
import { GetUser } from "src/authModule/getUserDecorator/getUserDecorator";
import { DeliveryAddressObject } from "src/types";
import { DefaultStudioEntity } from "../defaultStudioAddressEntity/defaultStudioAddressEntity";
import { DeliveryAddressDto, UpdateAddressDto } from "../deliveryDto/deliveryAddressDto";
import { DeliveryAddressEntity } from "../deliveryEntity/deliveryAddressEntity";
import { DeliveryService } from "../deliveryService/deliveryService";

@Controller('delivery')
@UseGuards(AuthGuard())
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('/createDeliveryAddress')
  @UsePipes(ValidationPipe)
  async createDeliveryAddress(
    @GetUser() user: AuthEntity,
    @Body() deliveryAddressDto: DeliveryAddressDto,
  ): Promise<DeliveryAddressObject> {
    return await this.deliveryService.createDeliveryAddress(
      user,
      deliveryAddressDto,
    );
  }

  @Post('/setStudioAddress')
  async setStudioAddress(
    @GetUser() user: AuthEntity,
  ): Promise<DefaultStudioEntity[]> {
    return await this.deliveryService.setStudioAddress(user);
  }

  @Get('/getAddresses')
  async getAddresses(
    @GetUser() user: AuthEntity,
  ): Promise<DeliveryAddressEntity[]> {
    return await this.deliveryService.getAddresses(user);
  }

  @Get('/getDefaultStudioAddress')
  async getDefaultStudioAddress(
    @GetUser() user: AuthEntity,
  ): Promise<DefaultStudioEntity> {
    return await this.deliveryService.getDefaultStudioAddress(user);
  }

  @Get('/getDefaultAddress')
  async getDefaultAddress(
    @GetUser() user: AuthEntity,
  ): Promise<DeliveryAddressEntity> {
    return await this.deliveryService.getDefaultAddress(user);
  }

  @Patch('/setDefaultStudioAddress/:studioId')
  @UsePipes(ValidationPipe)
  async setDefaultStudioAddress(
    @GetUser() user: AuthEntity,
    @Param('studioId') studioId: string,
  ): Promise<DefaultStudioEntity> {
    return await this.deliveryService.defaultStudioAddress(user, studioId);
  }

  @Patch('/updateAddress/:deliveryAddressId')
  @UsePipes(ValidationPipe)
  async updateAddress(
    @GetUser() user: AuthEntity,
    @Param('deliveryAddressId') deliveryAddressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<DeliveryAddressEntity> {
    return await this.deliveryService.updateAddress(
      user,
      updateAddressDto,
      deliveryAddressId,
    );
  }

  @Patch('/defaultAddress/:deliveryAddressId')
  @UsePipes(ValidationPipe)
  async defaultAddress(
    @GetUser() user: AuthEntity,
    @Param('deliveryAddressId') deliveryAddressId: string,
  ): Promise<DeliveryAddressEntity> {
    return await this.deliveryService.defaultAddress(user, deliveryAddressId);
  }

  @Delete('/deleteAddress/:deliveryAddressId')
  async deleteDeliveryAddress(
    @GetUser() user: AuthEntity,
    @Param('deliveryAddressId') deliveryAddressId: string,
  ): Promise<string> {
    return await this.deliveryService.deleteDeliveryAddress(
      user,
      deliveryAddressId,
    );
  }
}