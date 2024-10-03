import { Component, OnInit, output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2'
import { Store } from '@ngrx/store';
import { ItemsState } from '../store/items.reducer';
import { add, remove, total } from '../store/items.actions';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {


  items: CartItem[] = [];

  constructor(
    private store: Store<{items:ItemsState}> ,
    private router: Router ,
    private sharingDataService:SharingDataService){
      this.store.select('items').subscribe(state => {
        this.items = state.items;
        this.saveSession();
        //console.log('Cambio estado')
      })
    }

  ngOnInit(): void {
    this.store.dispatch(total())
    this.onDeleteCart();
    this.onAddCart();
  }


  onAddCart(){
    this.sharingDataService.productEventEmitter.subscribe(product => {

    this.store.dispatch(add({product: product}));
    this.store.dispatch(total())

    this.router.navigate(['/cart']);
    Swal.fire({
      title: "Shopping Cart",
      text: "Nuevo producto agregado al carro!",
      icon: "success"
    });
  });

  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
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

          this.store.dispatch(remove({id}));
          this.store.dispatch(total());
          this.saveSession();
          this.router.navigate(['/cart']);

          Swal.fire({
            title: "Eliminado!",
            text: "Se a eliminado el item del carrito compras.",
            icon: "success"
          });
        }
      });


    });
  }



  saveSession(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items))
  }

}
