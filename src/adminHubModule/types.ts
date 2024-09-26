export interface SurprisePackageObject{
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
  studioAddress: string;
  LGA: string;
  state: string;
  phoneNumber: string;
  deliveryBaseFee: string;
  deliveryPricePerKm: string;
  adminId: string;
}