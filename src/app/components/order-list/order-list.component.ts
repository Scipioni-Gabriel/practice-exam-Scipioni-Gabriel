import {Component, inject, OnInit} from '@angular/core';
import {ProductService} from "../../service/product.service";
import {OrderService} from "../../service/order.service";
import {Router, RouterLink} from "@angular/router";
import {Order} from "../../models/order";
import {DatePipe} from "@angular/common";
import {ProductOrder} from "../../models/product-order";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit{
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  emailOrName: string = '';

  allOrders: {
    timeStamp: Date | null;
    total: number;
    orderCode: string;
    id: string;
    customerName: string;
    email: string;
    products: ProductOrder[]
  }[] =[];
  filteredOrders: {
    timeStamp: Date | null;
    total: number;
    orderCode: string;
    id: string;
    customerName: string;
    email: string;
    products: ProductOrder[]
  }[] =[];







  getorders() {
    return this.orderService.getOrders().subscribe((data) => {
      this.allOrders = data.map(order => ({
        ...order,
        timeStamp: order.timeStamp ? new Date(order.timeStamp) : null
      }));
      this.filteredOrders = this.allOrders;
    });
  }


  ngOnInit(): void {
    this.getorders();
  }

  ordersByNameOrEmail() {
    if (this.emailOrName === '' || this.emailOrName === null) {
      this.filteredOrders = this.allOrders;
    } else {
      const searchTerm = this.emailOrName.toLowerCase();
      this.filteredOrders = this.allOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm)
      );
    }
  }




  protected readonly HTMLInputElement = HTMLInputElement;
}
