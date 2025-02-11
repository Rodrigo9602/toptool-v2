import { Product } from "./product"

export interface Sell {
    id: string,
    products: Product[]
    sellPrice: number
}