import { NotFoundException } from '@nestjs/common';
import { ProductDesignRateEntity } from 'src/adminHubModule/ProductDesignRateEntity/ProductDesignRateEntity';
import { ProductRateEntity } from 'src/adminHubModule/productRateEntity/productRateEntity';
import { SurprisePackageEntity } from 'src/adminHubModule/surprisePackageEntity/surprisePackageEntity';
import { FindOneOptions } from 'typeorm';

export const fetchRate = async () => {
  console.log('rate');
  const options: FindOneOptions<ProductRateEntity> = {};

  const rates: any = await ProductRateEntity.find(options);

  if (rates.length === 0) {
    throw new NotFoundException(' rate not found ');
  }

  const productRates = rates.map((rate) => ({
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
    samosaRate: rate.samosaRate,
    springRollRate: rate.springRollRate,
    samosa_springrollRate: rate.samosa_springrollRate,
    puffRate: rate.puffRate,
    pepperedMeatRate: rate.pepperedMeatRate,
    puff_pepperedMeatRate: rate.puff_pepperedMeatRate,
    samosa_pepperedMeatRate: rate.samosa_pepperedMeatRate,
    springroll_pepperedMeatRate: rate.springroll_pepperedMeatRate,
    meatPieRate: rate.meatPieRate,
    donutsRate: rate.donutsRate,
    cinamonRollsRate: rate.cinamonRollsRate,
    pancakesRate: rate.pancakesRate,
    corndogsRate: rate.corndogsRate,
    waffelsRate: rate.waffelsRate,
    meatpie_donutsRate: rate.meatpie_donutsRate,
    pancakes_corndogs_waffelsRate: rate.pancakes_corndogs_waffelsRate,
  }));
  return productRates;
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
    coveringRate: rate.covering,
  }));

  return designRates;
};

export const fetchPackages = async () => {
  const options: FindOneOptions<SurprisePackageEntity> = {};

  const packages = await SurprisePackageEntity.find(options);

  if (packages.length === 0) {
    throw new NotFoundException('packages not found');
  }

  const surprisePackage = packages.reduce(
    (acc, _package) => {
      switch (_package.packageName.toLowerCase()) {
        case 'bronze':
          acc.bronzePackage = _package;
          break;
        case 'silver':
          acc.silverPackage = _package;
          break;
        case 'gold':
          acc.goldPackage = _package;
          break;
        case 'diamond':
          acc.diamondPackage = _package;
          break;
      }
      return acc;
    },
    {
      bronzePackage: null,
      silverPackage: null,
      goldPackage: null,
      diamondPackage: null,
    },
  );
  return surprisePackage;
};
