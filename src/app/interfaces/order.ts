import { Client } from "./client";
import { Service } from "./service";
import { Warranty } from "./warranty";

export interface Order {
    id: String,
    client: Client,
    service: Service,
    warranty: Warranty,
}
