import { Order } from "../interfaces/order";

export const mockOrders: Order[] = [
    {
        id: '1',
        client: {
            id: '1',
            name: 'Carlos Antonio',
            lastname: 'Simón Gámez',
            ci: '87051127161',
            phone: '54177503',
            address: 'San Agustín no.7730, Reparto Mañana',
            registeredDate: new Date('2025-01-05')
        },
        services: [{
            id: '1',
            description: 'Sustitución de puerto de carga',
            servicesPrice: 6,
        }],
        warranty: {
            id: '1',
            emitedOn: new Date('2025-01-05'),
            timeStamp: new Date('2025-01-20')
        },
        totalPrice: 6
    },
    {
        id: '2',
        client: {
            id: '2',
            name: 'Carlos Alberto',
            lastname: 'Simón Gámez',
            ci: '87042227161',
            phone: '54177503',
            address: 'San Agustín no.7730, Reparto Mañana',
            registeredDate: new Date('2025-01-08')
        },
        services: [
            {
                id: '2',
                description: 'Reparación del conector de pantalla en Samsung A12',
                servicesPrice: 15,                
            },
            {
                id: '3',
                description: 'Sustitución de flex de botones en Samsung A12',
                servicesPrice: 8,
            }
        ],
        sells: [
            {   
                id: '1',
                products: [
                    {
                        id: '12',
                        name: 'Mica Samsung A12',
                        description: 'Mica de cristal templado para Samsung A12',
                        category: {
                            name: 'Micas'
                        },
                        price: 7,
                        stock: 30,
                        imageUrl: ''
                    }
                ],
                sellPrice: 7
            }
        ],
        warranty: {
            id: '1',
            emitedOn: new Date('2025-01-08'),
            timeStamp: new Date('2025-01-23')
        },
        totalPrice: 30
    },
    {
        id: '3',
        client: {
            id: '3',
            name: 'Juan Carlos',
            lastname: 'Simón Gámez',
            ci: '87051027161',
            phone: '54177503',
            address: 'San Agustín no.7730, Reparto Mañana',
            registeredDate: new Date('2025-02-08')
        },
        sells: [
           { 
                id: '2',
                products: [
                    {
                        id: '12',
                        name: 'Mica Samsung A12',
                        description: 'Mica de cristal templado para Samsung A12',
                        category: {
                            name: 'Micas'
                        },
                        price: 7,
                        stock: 30,
                        imageUrl: ''
                    },
                    {
                        id: '5',
                        name: 'Forro Samsung A12',
                        description: 'Forro de silicona para Samsung A12',
                        category: {
                            name: 'Forros'
                        },
                        price: 10,
                        stock:15,
                        imageUrl: ''
                    }
                ],
                sellPrice: 17
            }
        ],
        warranty: {
            id: '1',
            emitedOn: new Date('2025-02-08'),
            timeStamp: new Date('2025-02-23')
        },
        totalPrice: 17
    },
    
]