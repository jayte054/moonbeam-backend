import { OrderStatus } from './productOrders/ProductOrderEnum/productOrderEnum';

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
