interface Category {
    id: String,
    name: String
}

type productCategory = Omit<Category, 'id'>

export interface Product {
    id: String,
    name: String,
    description: String,
    category: productCategory,
    price: number,
    stock: number,
    imageUrl: String
}

export type appProduct = Omit<Product, 'id'>
