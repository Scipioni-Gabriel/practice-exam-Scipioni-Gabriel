import {ProductOrder} from "./product-order";

export interface Order {
  id : string,
  customerName : string,
  email : string,
  products : ProductOrder[],
  total : number,
  orderCode : string,
  timeStamp : Date
}


