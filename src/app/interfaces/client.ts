export interface Client {
    id: String,
    name: String,
    lastname: String,
    ci: String,    
    phone: String,
    address: String,  
    registeredDate: Date  
}

export type appClient = Omit<Client, 'id'>;