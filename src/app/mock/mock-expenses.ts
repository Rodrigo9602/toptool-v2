import { Expenses } from "../interfaces/expenses";

export const mockExpenses: Expenses[] = [
    {
        id: '1',
        name: 'Pago de Alquiler',
        date: new Date('2025-01-02'),
        cost: 5
    },
    {
        id: '2',
        name: 'Compra de firmwares IOS',
        date: new Date('2025-01-02'),
        cost: 3
    },
    {
        id: '3',
        name: 'Pago de Alquiler',
        date: new Date('2025-02-01'),
        cost: 5
    },
    {
        id: '4',
        name: 'Compra de alcohol isopropílico',
        date: new Date('2025-02-02'),
        cost: 2
    }    
]