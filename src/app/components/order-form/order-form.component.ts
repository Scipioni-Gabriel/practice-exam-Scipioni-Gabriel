import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import {ProductService} from "../../service/product.service";
import {OrderService} from "../../service/order.service";


@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  productosService: Product[] = [];
  hasDiscount: boolean = false;
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  total: number = 0;

  orderForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [this.emailOrdenesValidator()]),
    products: new FormArray([])
  });
  selectedProduct: Product | undefined;

  get products() {
    return this.orderForm.controls['products'] as FormArray;
  }

  addProduct() {
    this.products.push(new FormGroup({
      productId: new FormControl(),
      quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
      stock: new FormControl(),
      price: new FormControl()
    }));
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.productosService = data;
      this.addProduct()
    })
  }


  cambiarValor(_t27: number) {
    const productId = this.products.at(_t27).get('productId')?.value;
    const selectedProduct = this.productosService.find(p => p.id===productId);

    if(selectedProduct){
      this.products.at(_t27).patchValue({
        price:selectedProduct.price,
        stock:selectedProduct.stock
      });
    }
  }

  createOrder(){
    if(this.orderForm.valid){
      const order : Order ={
        id: '',
        customerName: this.orderForm.get('name')?.value,
        email: this.orderForm.get('email')?.value,
        products: this.products.value,
        total: this.calculateTotal(),
        orderCode: this.getOrderCode(),
        timeStamp: new Date()
      }
      this.orderService.createOrders(order).subscribe((data)=>{
        this.router.navigate(['/orders']);
      });
    }
  }

  getOrderCode():string{
    const name:string = this.orderForm.get('name')?.value;
    const email: string =  this.orderForm.get('email')?.value;
    return name.charAt(0)+email.slice(-4)+ new Date().toDateString();
  }

  calculateTotal():number{
    let total:number=0;
    this.products.controls.forEach(element => {
      total+=element.get('price')?.value*element.get('quantity')?.value;
    });
    if(total>1000){
      this.hasDiscount=true;
      total=total*0.9;
    }else {
      this.hasDiscount=false;
    }
    this.total = total;
    return total;
  }


  emailOrdenesValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.orderService.getOrdersByEmail(control.value).pipe(
        map((orders) => {
          let counterOrders = 0;

          // Obtener la fecha y hora actuales
          const now = new Date();

          // Calcular la fecha límite (hace 24 horas)
          const limitDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          // Contar las órdenes que fueron realizadas dentro de las últimas 24 horas
          orders.forEach(order => {
            const orderDate = new Date(order.timeStamp);

            if (orderDate >= limitDate && orderDate <= now) {
              counterOrders++;
            }
          });

          // Validar si hay más de 3 órdenes en las últimas 24 horas
          if (counterOrders >= 3) {
            return { tooManyOrders: true };  // Error si hay más de 3 pedidos en las últimas 24 horas
          }

          return null;  // Si no, el control es válido
        }),
        catchError(() => of(null))  // Si ocurre un error en la llamada al servicio, devolver null (validación exitosa)
      );
    };
  }
  sameProductValidator(formArray: FormArray): ValidationErrors | null {
    const productIds = formArray.controls.map(control => control.get('productId')?.value);


    const duplicates = productIds.some((id, index) => productIds.indexOf(id) !== index);

    if (duplicates) {
      return { sameProduct: true };
    }
    return null;
  }
}
