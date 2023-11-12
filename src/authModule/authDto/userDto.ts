import { ProductOrderEntity } from 'src/productOrders/productOrderEntity/productOrderEntity';

export class UserDto {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  orderName: ProductOrderEntity;
}
