import { OrderStatus, ProductFlavours, VariantType } from './productOrders/ProductOrderEnum/productOrderEnum';

export type bronzePackageObject = {
  itemOne: string;
  itemTwo: string;
  itemThree: string;
  itemFour: string;
  itemFive: string;
  itemSix: string;
  description: string;
};

export type silverPackageObject = {
  itemOne: string;
  itemTwo: string;
  itemThree: string;
  itemFour: string;
  itemFive: string;
  itemSix: string;
  itemSeven: string;
  itemEight: string;
  description: string;
};

export type goldPackageObject = {
  itemOne: string;
  itemTwo: string;
  itemThree: string;
  itemFour: string;
  itemFive: string;
  itemSix: string;
  itemSeven: string;
  itemEight: string;
  itemNine: string;
  itemTen: string;
  description: string;
};

export type diamondPackageObject = {
  itemOne: string;
  itemTwo: string;
  itemThree: string;
  itemFour: string;
  itemFive: string;
  itemSix: string;
  itemSeven: string;
  itemEight: string;
  itemNine: string;
  itemTen: string;
  itemEleven: string;
  itemTwelve: string;
  description: string;
};

export type bronzePackageOrderType = {
  packageId: string;
  packageName: string;
  packageOrderName: string;
  bronzePackage: {
    itemOne: string;
    itemTwo: string;
    itemThree: string;
    itemFour: string;
    itemFive: string;
    itemSix: string;
    description: string;
  };
  imageUrl: string;
  price: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  addInfo: string;
  userId: string;
};

export type silverPackageOrderType = {
  packageId: string;
  packageName: string;
  packageOrderName: string;
  silverPackage: {
    itemOne: string;
    itemTwo: string;
    itemThree: string;
    itemFour: string;
    itemFive: string;
    itemSix: string;
    itemSeven: string;
    itemEight: string;
    description: string;
  };
  imageUrl: string;
  price: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  addInfo: string;
  userId: string;
};

export type goldPackageOrderType = {
  packageId: string;
  packageName: string;
  packageOrderName: string;
  goldPackage: {
    itemOne: string;
    itemTwo: string;
    itemThree: string;
    itemFour: string;
    itemFive: string;
    itemSix: string;
    itemSeven: string;
    itemEight: string;
    itemNine: string;
    itemTen: string;
    description: string;
  };
  imageUrl: string;
  price: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  addInfo: string;
  userId: string;
};

export type diamondPackageOrderType = {
  packageId: string;
  packageName: string;
  packageOrderName: string;
  diamondPackage: {
    itemOne: string;
    itemTwo: string;
    itemThree: string;
    itemFour: string;
    itemFive: string;
    itemSix: string;
    itemSeven: string;
    itemEight: string;
    itemNine: string;
    itemTen: string;
    itemEleven: string;
    itemTwelve: string;
    description: string;
  };
  imageUrl: string;
  price: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  addInfo: string;
  userId: string;
};

export type customPackageOrderType = { 
  orderName: string;
  item: string[]; 
  deliveryDate: string;  
  addInfo: string;
}

export type chopsOrderType = {
  orderName: string;
  chopType: string;
  numberOfPacks: string;
  deliveryDate: string;
  description: string;
}

export type CartObject = {
  itemName: string;
  price:string;
  imageUrl:string;
  quantity: string;
  productOrderId: string;
  userId: string
}

export type VariantCakeObject = {
  variantId: string;
  orderName: string;
  type: VariantType;
  productFlaovur?: ProductFlavours;
  price: string;
  quantity: string;
  description: string;
  deliveryDate: string;
  userId: string;
};
