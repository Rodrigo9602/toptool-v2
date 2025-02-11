import { Order } from './order';
import { Product } from './product';

type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: Role;
  orders: Order[];
  products: Product[];
}

export type userRegister = Omit<User, 'id' | 'role' | 'orders' | 'products'>
