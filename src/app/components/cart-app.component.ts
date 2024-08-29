import { Component, OnInit, output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from './catalog/catalog.component';
import { CartComponent } from './cart/cart.component';
import { CartItem } from '../models/cartItem';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, CartComponent],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {

  products: Product[] = [];

  items: CartItem[] = [];

  total: number = 0;

  constructor(private service:ProductService){ }

  ngOnInit(): void {
    this.products = this.service.findAll();
    this.items = JSON.parse(sessionStorage.getItem('cart')!) || [];
    this.calcularTotal();
  }


  onAddCart(product: Product){
    const hasItem = this.items.find(item => item.product.id === product.id)
    if (hasItem) {
      this.items = this.items.map(item => {
        if(item.product.id === product.id){
          return {
            ... item,
            quantity: item.quantity + 1
          }
        } else {
          return item;
        }
      })
    } else {
      this.items = [... this.items, { product:{... product},quantity:1}];
    }

    this.calcularTotal();
    this.saveSession();
  }

  onDeleteCart(id: number): void {
    this.items = this.items.filter(item => item.product.id !== id);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.items.reduce( (accumulator, item) => accumulator + item.quantity * item.product.price, 0);
    this.saveSession();
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items))
  }
}
