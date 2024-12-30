import { Order } from './order';
import { Product } from './product';

type Role = 'admin' | 'user';


export interface User {
    id: String,
    name: String,
    lastname: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    role: Role,
    orders: Order[],
    products: Product[]
}
