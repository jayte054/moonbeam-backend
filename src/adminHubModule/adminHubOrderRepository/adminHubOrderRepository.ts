import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { AllOrdersRepository } from 'src/productOrders/productOrderRepository/allOrdersRepository';
import { AllOrdersObject, PaidOrdersDto } from 'src/types';
import { Repository } from 'typeorm';

@Injectable()
export class AdminHubOrderRepository {
  private logger = new Logger('AdminHubOrderRepository');
  constructor(
    @InjectRepository(AllOrdersRepository)
    private readonly allOrdersRepository: AllOrdersRepository,
  ) {}

  fetchUserOrders = async (
    admin: AdminAuthEntity,
  ): Promise<PaidOrdersDto[]> => {
    if (!admin.isAdmin) {
      this.logger.error('user is not an admin');
      throw new InternalServerErrorException('user not allowed');
    }
    try {
      const orders = await this.allOrdersRepository.allPaidOrders();

      if (!orders) {
        this.logger.error('orders table empty');
        throw new NotFoundException('no orders to fetch');
      }
      return orders;
    } catch (error) {
      this.logger.error('failed to fetch orders');
      throw new InternalServerErrorException('failed to fetch orders');
    }
  };
}
