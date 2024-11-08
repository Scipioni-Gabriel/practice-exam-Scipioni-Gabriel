import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Order} from "../models/order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = "http://localhost:3000/orders"

  getOrders() : Observable<Order[]>{
    return this.httpClient.get<Order[]>(this.baseUrl);
  }
  createOrders(order: Order) : Observable<Order[]>{
    return this.httpClient.post<Order[]>(this.baseUrl, order);
  }
  getOrdersByEmail(email: string) : Observable<Order[]>{
    return this.httpClient.get<Order[]>(this.baseUrl+'?email='+email);
  }

  constructor() { }
}
