import { NotFoundException } from '@nestjs/common';
import { ProductRateEntity } from 'src/adminHubModule/productRateEntity/productRateEntity';
import { FindOneOptions } from 'typeorm';

export const fetchRate = async () => {
  console.log('rate');
  const options: FindOneOptions<ProductRateEntity> = {};

  const rates: any = await ProductRateEntity.find(options);

  if (rates.length === 0) {
    throw new NotFoundException(' rate not found ');
  }

  const cakeRates = rates.map((rate) => ({
    chocolateCakeRate: rate.chocolateCakeRate,
    strawberryCakeRate: rate.strawberryCakeRate,
    vanillaCakeRate: rate.vanillaCakeRate,
    redvelvetCakeRate: rate.redvelvetCakeRate,
    carrotCakeRate: rate.carrotCakeRate,
    cheeseCakeRate: rate.cheeseCakeRate,
    bananaCakeRate: rate.bananaCakeRate,
    appleCakeRate: rate.appleCakeRate,
    lemonCakeRate: rate.lemonCakeRate,
    coffeeCakeRate: rate.coffeeCakeRate,
    coconutCakeRate: rate.coconutCakeRate,
    blueberryCakeRate: rate.blueberryCakeRate,
  }));
  return cakeRates;
};

// const options: FindOneOptions<ProductOrderEntity> = {};

// const orders: any = await this.find(options);
// if (!orders) {
//   this.logger.error('orders not found');
//   throw new NotFoundException('orders not found');
// }
// this.logger.verbose('orders fetched successfully');
// return orders;
