import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  activeBtn = false;

  constructor(private router: Router) {}

  onUsers() {
    if (this.router.url != '/admin/users') {
      this.router.navigate(['/admin/users']);
    } else {
      this.activeBtn = false;
    }
  }

  onProducts() {
    if (this.router.url != '/admin/products') {
      this.router.navigate(['/admin/products']);
    } else {
      this.activeBtn = false;
    }
  }

  onSales() {
    if (this.router.url != '/admin/sales') {
      this.router.navigate(['/admin/sales']);
    } else {
      this.activeBtn = false;
    }
  }

  hamburgerBtn() {
    this.activeBtn = !this.activeBtn;
  }
}
