import { Injectable, Logger } from '@nestjs/common';
import { async } from 'rxjs';
import { AdminAuthEntity } from 'src/authModule/adminAuthEntity/adminAuthEntity';
import { DataSource, Repository } from 'typeorm';
import { ProductRateEntity } from '../productRateEntity/productRateEntity';

@Injectable()
export class AdminHubRepository extends Repository<ProductRateEntity> {
  private logger = new Logger('AdminHubRepository');
  constructor(private dataSource: DataSource) {
    super(ProductRateEntity, dataSource.createEntityManager());
  }

  productRate = async (admin: AdminAuthEntity) => {
    console.log('rate is 1000');
  };
}
