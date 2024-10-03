import { Component, EventEmitter, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { ItemsState } from '../../store/items.reducer';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

items: CartItem[] = [];

total = 0;


constructor(
  private store: Store<{items: ItemsState}>,
  private sharingDataService: SharingDataService) {
  
  this.store.select('items').subscribe(state => {
    this.items = state.items;
    this.total = state.total;
  });
  
}
  ngOnInit(): void {
  }

  onDeleteCart(id: number){
    this.sharingDataService.idProductEventEmitter.emit(id);
  }


}
