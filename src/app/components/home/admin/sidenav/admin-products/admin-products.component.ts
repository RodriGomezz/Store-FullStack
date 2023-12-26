import {
  Component,
  effect,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { ProductsDetailsComponent } from 'src/app/components/products-details/products-details.component';
import { SpinnerComponent } from 'src/app/components/shared/spinner/spinner.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminProductsService } from './admin-products.service';
import { FiveWordsPipe } from 'src/app/components/shared/pipes/five-words.pipe';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from '../../sidenav/sidenav.component';

@Component({
  selector: 'app-admin-products',
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
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    SidenavComponent,
  ],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  items: number[] = [];
  res: any;
  elements = 0;
  response: any;
  pageIndex = 0;
  pageSize = 20;
  pageEvent?: PageEvent;
  spinner = true;
  selectedCategory?: string = 'all';
  math = Math;
  Number = Number;
  product: any;
  edit: any = [];
  editItem!: number;
  dataProduct = {
    title: '',
    description: '',
    price: '',
    image1: '',
    image2: '',
    image3: '',
    rating: {
      rate: '',
      count: '',
    },
    category: '',
    active: '',
  };
  selectedCategorySaved: any;
  numberOfImage = 1;

  constructor(
    private adminProductsService: AdminProductsService,
    private router: Router,
    public dialog: MatDialog
  ) {
    effect(() => {
      this.response = this.adminProductsService.allProducts();
      this.items = [];
      for (let i = 0; i < this.response.length; i++) {
        this.items.push(i);
      }
      this.elements = this.response.length;
    });
  }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems() {
    if (!this.response[0] || this.selectedCategorySaved === 'all') {
      this.adminProductsService.getItems(this.pageSize).subscribe((res) => {
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

  addToCart() {}

  productDetails(item: number) {
    this.adminProductsService.shareProductDetails(this.response[item]);
    this.router.navigate([
      '/product',
      this.response[item].title,
      this.response[item].id,
    ]);
    this.adminProductsService.ProductSelectedSignal(this.response[item]);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.adminProductsService
      .getItemsPagination(this.pageIndex, this.pageSize, this.selectedCategory)
      .subscribe((res) => {
        this.res = res;
        this.response = this.res.product;
        this.items = [];
        for (let i = 0; i < this.response.length; i++) {
          this.items.push(i);
        }
      });
    this.closeEdit();
  }

  editData(item: number) {
    if (this.editItem) {
      this.edit[this.editItem] = false;
    }
    this.edit[item] = true;
    this.dataProduct = this.response[item];
    this.editItem = item;
  }

  closeEdit() {
    if (this.edit[this.editItem] == true) {
      this.edit[this.editItem] = false;
    }
  }

  saveEditData(item: number) {
    this.adminProductsService.editDataBase(this.response[item]).subscribe();
  }

  disableItem(item: number) {
    if (typeof this.response[item].active == 'string') {
      this.response[item].active = this.response[item].active === 'true';
    }
    this.response[item].active = !this.response[item].active;

    this.adminProductsService
      .disableItemService(this.response[item]._id, this.response[item].active)
      .subscribe();
  }

  deleteItem(item: number) {
    this.adminProductsService
      .deleteItemService(this.response[item].id)
      .subscribe();
  }

  openAddProduct(edit: string) {
    this.dialog.open(ModalProductComponent, {
      width: '30%',
      data: {
        edit,
      },
    });
  }

  editProduct() {
    this.adminProductsService.editDataBase(this.dataProduct).subscribe();
    this.closeEdit();
  }

  leftArrowImg(item) {
    if (this.numberOfImage > 1) {
      this.numberOfImage -= 1;
      this.response[item].number = this.numberOfImage;
    }
  }
  rightArrowImg(item) {
    this.numberOfImage += 1;
    this.response[item].number = this.numberOfImage;
  }
}
