import { Component, OnInit, output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {


  items: CartItem[] = [];

  total: number = 0;

  constructor(
    private router: Router ,
    private sharingDataService:SharingDataService ,
    private service:ProductService){ }

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]') ;
    this.calcularTotal();
    this.onDeleteCart();
    this.onAddCart();
  }


  onAddCart(){
    this.sharingDataService.productEventEmitter.subscribe(product => {
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
    this.router.navigate(['/cart'], {
      state: {items:this.items, total: this.total},
    })

    Swal.fire({
      title: "Shopping Cart",
      text: "Nuevo producto agregado al carro!",
      icon: "success"
    });
  });
    
  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      console.log(id + ' Se haejecutado el evento idProductEventEmitter')
      
      Swal.fire({
        title: "Estas seguro qiue deseas eliminar este producto?",
        text: "Cuidado el items se perdera para siempre",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(item => item.product.id !== id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart')
            sessionStorage.clear();
          }
          this.calcularTotal();
          this.saveSession();
          this.router.navigateByUrl('/',{skipLocationChange: true}).then(() => {
            this.router.navigate(['/cart'], {
            state: {items:this.items, total: this.total},
            });
          }); 
          
          Swal.fire({
            title: "Eliminado!",
            text: "Se a eliminado el item del carrito compras.",
            icon: "success"
          });
        }
      });
      

    });
  }

  calcularTotal(): void {
    this.total = this.items.reduce( (accumulator, item) => accumulator + item.quantity * item.product.price, 0);
    this.saveSession();
  }

  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items))
  }

}
