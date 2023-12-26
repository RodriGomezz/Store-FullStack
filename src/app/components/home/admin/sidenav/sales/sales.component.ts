import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav.component';
import { ProductsService } from '../../../products/products.service';
import { titlePipe } from 'src/app/components/shared/pipes/title.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminProductsService } from '../admin-products/admin-products.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, SidenavComponent, titlePipe, MatExpansionModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  products: any;
  data = [];
  items = [];
  users = [];
  panelOpenState = false;

  constructor(private adminProductService: AdminProductsService) {}

  ngOnInit(): void {
    this.adminProductService.getBoughtItems().subscribe((res) => {
      this.products = res;
      for (let a = 0; a < this.products.boughtItems.length; a++) {
        this.users.push(a);
        for (let i = 0; i < this.products.boughtItems[a].items.length; i++) {
          this.data.push(i);
        }
        this.items.push(this.data);
        this.data = [];
      }
    });
  }
}
