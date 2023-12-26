import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../home/products/products.service';
import { SharedService } from '../shared/shared.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, MatIconModule],
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css'],
})
export class ProductsDetailsComponent implements OnInit {
  productDetails: any;
  countItems = signal<number>(1);
  webStorage: any;
  productsAndItems: any = [];
  storage: any;
  imgSelected: any;
  isLoading = true;
  math = Math;
  Number = Number;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private sharedService: SharedService,
    private router: Router
  ) {
    effect(() => {
      this.productDetails = this.productsService.productSelected();
      this.imgSelected = this.productDetails.image1;
      if (this.imgSelected) this.isLoading = false;
    });

    if (localStorage.getItem('products')) {
      this.storage = localStorage.getItem('products');
      this.productsAndItems = JSON.parse(this.storage);
    }
  }

  ngOnInit() {
    if (Object.keys(this.productDetails).length === 0) {
      this.route.params.subscribe((params) => {
        const id = params['id'];
        this.productsService.getProductByRoute(id).subscribe((res) => {
          this.productDetails = res;
          this.imgSelected = this.productDetails.image1;
          this.isLoading = false;
        });
      });
    }
  }

  leftArrow() {
    if (this.countItems() > 1)
      this.countItems.update((currentItems) => currentItems - 1);
  }

  rightArrow() {
    this.countItems.update((currentItems) => currentItems + 1);
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  addToCart() {
    if (this.webStorage === null)
      this.sharedService.itemsToCart.set(this.countItems());
    else {
      this.sharedService.itemsToCart.update(
        (count) => count + this.countItems()
      );
    }
    localStorage.setItem(
      'items',
      JSON.stringify(this.sharedService.itemsToCart())
    );
    this.productsAndItems.push({
      product: this.productDetails,
      items: this.countItems(),
    });
    localStorage.setItem('products', JSON.stringify(this.productsAndItems));
    this.sharedService.ProductToCart.set(this.productDetails);
  }

  imgClicked(img) {
    this.imgSelected = img;
  }
}
