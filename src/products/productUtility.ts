import { NotFoundException } from '@nestjs/common';
import { ProductDesignRateEntity } from 'src/adminHubModule/ProductDesignRateEntity/ProductDesignRateEntity';
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

export const fetchDesignRate = async () => {
  const options: FindOneOptions<ProductDesignRateEntity> = {};

  const rates = await ProductDesignRateEntity.find(options);

  if (rates.length === 0) {
    throw new NotFoundException('rates not found');
  }

  const designRates = rates.map((rate) => ({
    nakedRate: rate.nakedRate,
    butterCreamRate: rate.butterCreamRate,
    fundantRate: rate.fundantRate,
  }));

  return designRates;
};
