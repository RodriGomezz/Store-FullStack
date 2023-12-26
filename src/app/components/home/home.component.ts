import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { AdminProductsComponent } from './admin/sidenav/admin-products/admin-products.component';
import { CarouselComponent } from './carousel/carousel.component';
import { MatIconModule } from '@angular/material/icon';

import { ModalProductComponent } from './admin/sidenav/admin-products/modal-product/modal-product.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductsComponent,
    AdminProductsComponent,
    MatIconModule,
    ModalProductComponent,
    CarouselComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  data = '';

  constructor(private authService: AuthService) {}

  selectedCategory(category: any) {
    this.data = category;
  }
}
