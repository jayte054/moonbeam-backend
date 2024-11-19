import { AuthEntity } from './authModule/authEntity/authEntity';
import {
  CategoryType,
  ChopPackageType,
  ChopProductType,
  Covering,
  NumberOfPacks,
  OrderStatus,
  PastryPackageType,
  ProductFlavours,
  VariantType,
} from './productOrders/ProductOrderEnum/productOrderEnum';

export type ChopsOrderType = {
  id: string;
  orderTitle: string;
  type: ChopProductType;
  category: CategoryType;
  imageUrl: string;
  chopPackageType: ChopPackageType;
  customChopPackage: string;
  numberOfPacks: NumberOfPacks;
  customNumberOfPacks: string;
  pastryPackageType: PastryPackageType;
  customPastryPackage: string;
  covering: Covering;
  price: string;
  deliveryDate: string;
  userId: string;
  description: string;
  status: OrderStatus;
};
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
  category: CategoryType;
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
  category: CategoryType;
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
  category: CategoryType;
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
  category: CategoryType;
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
  category: string;
  deliveryDate: string;
  addInfo: string;
};

export type chopsOrderType = {
  orderName: string;
  chopType: string;
  category: CategoryType;
  numberOfPacks: string;
  deliveryDate: string;
  description: string;
};

export type CartObject = {
  itemName: string;
  price: string;
  imageUrl: string;
  quantity: string;
  category: string;
  productOrderId: string;
  deliveryDate: string;
  userId: string;
};

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

export interface DeliveryAddressObject {
  deliveryAddressId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  additionalPhoneNumber?: string;
  deliveryAddress: string;
  region: string;
  city: string;
  defaultAddress: boolean;
  userId: string;
}

export interface DefaultStudioAddressObject {
  studioId: string;

  studioTitle: string;

  studioAddress: string;

  LGA: string;

  state: string;

  phoneNumber: string;

  deliveryBaseFee: string;

  deliveryPricePerKm: string;

  defaultStudioAddress: boolean;

  user: AuthEntity;

  userId: string;
}

export interface PaymentObject {
  paymentId: string;
  userId: string;
  amount: string;
  reference: string;
  iv: string;
  status: string;
  date: string;
}

export interface verificationDto {
  reference: string;
  iv: string;
  paymentId: string;
}

export interface ReferenceObject {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export interface RequestObject {
  requestId: string;
  requestTitle: string;
  orderType: string;
  quantity: string;
  content: string | string[];
  deliveryDate: string;
  category: string;
  status: string;
  productOrderId: string;
  userId: string;
}

export interface OrderObject {
  orderId: string;
  orderName: string;
  orderDate: string;
  imageUrl?: string;
  quantity: string;
  price: string;
  content?: string[];
  deliveryDate: string;
  userId: string;
}

export interface RtgOrderObject {
  rtgOrderId: string;
  orderName: string;
  orderType: string;
  cakeMessage?: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  price: string;
  userId: string;
}

export interface AllOrdersDto {
  id: string;
  orderType: string;
  orderDate?: string;
  deliveryDate?: string;
  amount: string;
  status: string;
}

export interface AllOrdersObject {
  budgetCake: AllOrdersDto[];
  cakeVariant: AllOrdersDto[];
  chopOrders: AllOrdersDto[];
  chopRequestOrders: AllOrdersDto[];
  customCakeOrders: AllOrdersDto[];
  customPackageOrders: AllOrdersDto[];
  packageOrders: AllOrdersDto[];
  customProductOrders: AllOrdersDto[];
  rtgOrders: AllOrdersDto[];
}

export interface PaidOrdersDto {
  id: string;
  orderName: string;
  imageUrl: string;
  orderType: string | string[] | undefined;
  category: string;
  date: string;
  amount: string;
  deliveryStatus: string;
  deliveryDate: string;
  status: string;
}
