import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { products } from '../data/prduct.data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  findAll(): Product[]{
    return products;
  }
}
