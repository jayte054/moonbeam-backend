export interface SurprisePackageObject {
  packageName: string;
  itemOne: string;
  itemTwo: string;
  itemThree: string;
  itemFour: string;
  itemFive: string;
  itemSix: string;
  itemSeven?: string;
  itemEight?: string;
  itemNine?: string;
  itemTen?: string;
  itemEleven?: string;
  itemTwelve?: string;
  imageUrl: string;
  price: string;
  date: string;
  adminId: string;
  description: string;
}

export interface StudioObject {
  studioTitle: string;
  studioAddress: string;
  LGA: string;
  state: string;
  phoneNumber: string;
  deliveryBaseFee: string;
  deliveryPricePerKm: string;
  defaultStudioAddress: boolean;
  adminId: string;
}

export enum productVariant {
  Cakes = 'Cakes',
  Chops = 'Chops',
}

export interface rtgProductObject {
  rtgId: string;
  rtgName: string;
  rtgType: productVariant;
  rtgPrice: string;
  rtgImageUrl: string;
  rtgDescription: string;
  date: string;
  adminId: string;
}
