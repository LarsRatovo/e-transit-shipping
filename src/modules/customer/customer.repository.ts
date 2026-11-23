import { Customer } from "./customer.types.js";

export interface CustomerRepository{
    findAll(ids : string[]) : Promise<Customer[]>
    find(id : string) : Promise<Customer | null>
}