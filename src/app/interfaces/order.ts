import { Client } from "./client";
import { Sell } from "./sell";
import { Service } from "./service";
import { Warranty } from "./warranty";

export interface Image {
    fileName: string,
    fileSize: number,
    lastModified: number,
    fileUrl: string
}

export interface Order {
    id: string,
    client: Client,
    services?: Service[],
    sells?: Sell[]
    devicesImages?: Image[],
    warranty: Warranty,
    totalPrice: number,
}
