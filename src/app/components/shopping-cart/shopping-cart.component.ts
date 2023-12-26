import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService } from '../home/products/products.service';
import { SharedService } from '../shared/shared.service';

import { FiveWordsPipe } from 'src/app/components/shared/pipes/five-words.pipe';

import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FiveWordsPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  response: any = '';
  items: any = [];
  storageKeys: any;
  storageItems: any;
  storage: any;
  totalPrice = 0;
  price = signal(0);
  productsAndItems = [{}];
  deletedItem: any;
  formBuyer = {
    address1: '',
    address2: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
    telephone: '',
  };

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private productsService: ProductsService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('products')) {
      this.storage = localStorage.getItem('products');

      this.storageItems = JSON.parse(this.storage);
      this.storageKeys = Object.keys(this.storageItems).length;

      for (let i = 0; i < this.storageKeys; i++) {
        this.items.push(i);
        this.price.update(
          (value) =>
            value +
            this.storageItems[i].items * this.storageItems[i].product.price
        );
      }
    }
  }

  deleteItem(item: number) {
    this.deletedItem = item;
    setTimeout(() => {
      let itemsStorage = Number(localStorage.getItem('items'));
      itemsStorage -= this.storageItems[item].items;
      localStorage.setItem('items', String(itemsStorage));
      this.price.update(
        (value) =>
          value -
          this.storageItems[item].items * this.storageItems[item].product.price
      );
      delete this.storageItems[item];

      this.storageItems = Object.values(this.storageItems);
      localStorage.setItem('products', JSON.stringify(this.storageItems));

      const index = this.items.indexOf(item);
      if (index > -1) this.items.splice(-1, 1);

      this.sharedService.itemsToCart.set(Number(itemsStorage));
      this.deletedItem = '';
    }, 1000);
  }

  leftArrow(item: string) {
    if (this.storageItems[item].items > 1) {
      this.storageItems[item].items--;
      this.productsAndItems = this.storageItems;
      this.sharedService.itemsToCart.update((data) => data - 1);

      localStorage.setItem('products', JSON.stringify(this.productsAndItems));
      localStorage.setItem(
        'items',
        JSON.stringify(this.sharedService.itemsToCart())
      );

      this.price.update(
        (value) => value - this.storageItems[item].product.price
      );
    }
  }

  rightArrow(item: string) {
    this.storageItems[item].items++;
    this.productsAndItems = this.storageItems;
    this.sharedService.itemsToCart.update((data) => data + 1);

    localStorage.setItem('products', JSON.stringify(this.productsAndItems));
    localStorage.setItem(
      'items',
      JSON.stringify(this.sharedService.itemsToCart())
    );

    this.price.update(
      (value) => value + Number(this.storageItems[item].product.price)
    );
  }

  productDetailsCart(item: number) {
    this.productsService.shareProductDetails(this.storageItems[item].product);
    this.router.navigate([
      '/product',
      this.storageItems[item].product.title,
      this.storageItems[item].product.id,
    ]);
    this.productsService.ProductSelectedSignal(this.storageItems[item].product);
  }

  onSubmit(data: NgForm) {
    if (localStorage.getItem('userData')) {
      this.formBuyer.address1 = data.form.value.address1;
      this.formBuyer.address2 = data.form.value.address2;
      this.formBuyer.apartment = data.form.value.apartment;
      this.formBuyer.city = data.form.value.city;
      this.formBuyer.country = data.form.value.country;
      this.formBuyer.postalCode = data.form.value.postalCode;
      this.formBuyer.telephone = data.form.value.telephone;

      this.productsService
        .buyItems(
          JSON.parse(localStorage.getItem('userData')).email,
          this.formBuyer,
          JSON.parse(localStorage.getItem('products')),
          this.price()
        )
        .subscribe();
      localStorage.removeItem('products');
      localStorage.removeItem('items');
    } else {
      this.router.navigate(['/auth']);
    }
  }

  homePage() {
    window.location.href = '';
  }
}
