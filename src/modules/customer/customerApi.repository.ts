import { env } from "../../config/env.js";
import { CustomerRepository } from "./customer.repository.js";
import { Customer } from "./customer.types.js";

export class CustomerApiRepository implements CustomerRepository{
    
    URI : string = "/v1/customers";

    async find(id: string): Promise<Customer | null> {
        const response = await fetch(env.customerServiceUrl+this.URI+"/"+id,{
            method:"GET"
        });

        if(!response.ok){
            console.log(response);
            return null;
        }

        return response.json() as Promise<Customer>;
    }
    
    findAll(ids: string[]): Promise<Customer[]> {
        throw new Error("Method not implemented.");
    }
    
}