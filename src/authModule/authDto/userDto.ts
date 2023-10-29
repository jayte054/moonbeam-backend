import { ProductOrderEntity } from 'src/products/productEntity/productOrderEntity';

export class UserDto {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  orderName: ProductOrderEntity;
}
