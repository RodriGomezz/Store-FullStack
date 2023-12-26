import {
  Component,
  Input,
  OnInit,
  effect,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { ProductsDetailsComponent } from '../../products-details/products-details.component';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ProductsService } from './products.service';
import { FiveWordsPipe } from 'src/app/components/shared/pipes/five-words.pipe';
import { titlePipe } from 'src/app/components/shared/pipes/title.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    ProductsDetailsComponent,
    SpinnerComponent,
    MatPaginatorModule,
    MatIconModule,
    FiveWordsPipe,
    titlePipe,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnChanges {
  items: number[] = [];
  res: any;
  elements = 0;
  response: any;
  pageIndex = 0;
  pageSize = 10;
  pageEvent?: PageEvent;
  spinner = true;
  @Input() selectedCategory?: string;
  math = Math;
  Number = Number;
  selectedCategorySaved: any;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {
    effect(() => {
      this.response = this.productsService.allProducts();
      if (!!this.response[0]) this.spinner = false;
      this.items = [];
      for (let i = 0; i < this.response.length; i++) {
        this.items.push(i);
      }
      this.elements = this.response.length;
    });
  }

  ngOnInit(): void {
    if (!this.response[0]) this.getAllItems();
  }

  getAllItems() {
    if (!this.response[0] || this.selectedCategorySaved === 'all') {
      this.productsService.getItems(this.pageSize).subscribe((res) => {
        this.res = res;
        this.response = this.res.product;
        this.spinner = false;
        this.items = [];
        for (let i = 0; i < this.response.length; i++) {
          this.items.push(i);
        }
        this.elements = this.res.countElements;
      });
      this.pageIndex = 0;
    } else {
      this.spinner = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedCategory.currentValue &&
      changes.selectedCategory.currentValue != 'all'
    ) {
      this.productsService
        .getItemsForCategory(this.selectedCategory, this.pageSize)
        .subscribe((res) => {
          this.spinner = true;
          this.elements = 0;
          this.res = res;
          this.response = this.res.product;
          this.spinner = false;
          this.items = [];
          for (let i = 0; i < this.response.length; i++) {
            this.items.push(i);
          }
          this.elements = this.res.countElements;
        });
      this.pageIndex = 0;
    } else {
      this.selectedCategorySaved = changes.selectedCategory.currentValue;
      this.getAllItems();
    }
  }

  addToCart() {}

  productDetails(item: number) {
    this.productsService.shareProductDetails(this.response[item]);
    this.router.navigate([
      '/product',
      this.response[item].title,
      this.response[item].id,
    ]);
    this.productsService.ProductSelectedSignal(this.response[item]);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.productsService
      .getItemsPagination(this.pageIndex, this.pageSize, this.selectedCategory)
      .subscribe((res) => {
        this.res = res;
        this.response = this.res.product;
        this.items = [];
        for (let i = 0; i < this.response.length; i++) {
          this.items.push(i);
        }
      });
  }
}
