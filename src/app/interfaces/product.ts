interface Category {
    id: string,
    name: string
}

type productCategory = Omit<Category, 'id'>

export interface Product {
    id: string,
    name: string,
    description: string,
    category: productCategory,
    price: number,
    stock: number,
    imageUrl: string
}
