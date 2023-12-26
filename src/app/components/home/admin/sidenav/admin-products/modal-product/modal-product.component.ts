import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AdminProductsService } from '../admin-products.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { AdminProductsComponent } from '../admin-products.component';

@Component({
  selector: 'app-modal-product',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.css'],
})
export class ModalProductComponent implements OnInit {
  product = {
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

  constructor(
    private adminProductsService: AdminProductsService,
    public dialogRef: MatDialogRef<ModalProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminProductsComponent
  ) {}

  ngOnInit(): void {}

  addProduct() {
    this.adminProductsService.addProductService(this.product).subscribe();
  }
}
