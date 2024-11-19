import { NotFoundException } from '@nestjs/common';
import { RequestEntity } from 'src/productOrders/productOrderEntity/requestEntity';
import { RequestObject } from 'src/types';
import { FindOneOptions } from 'typeorm';

export const fetchRequests = async () => {
  const options: FindOneOptions<RequestEntity> = {};

  const requests: RequestObject[] = await RequestEntity.find(options);

  if (requests.length === 0) {
    throw new NotFoundException('requests not found');
  }

  return requests;
};
