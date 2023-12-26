import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedService } from '../shared.service';
import { ProductsService } from '../../home/products/products.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    MatInputModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showNavbar = true;
  itemsToCart: any = 0;
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions?: Observable<string[]>;
  searchInput?: string;
  productsAutocomplete: any;
  filteredArray: any;
  firstWord = '';
  existUser = false;
  isAdmin = 'user';

  constructor(
    private sharedService: SharedService,
    private productsService: ProductsService,
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      this.showNavbar = this.sharedService.showNavBarService();
      this.itemsToCart = this.sharedService.itemsToCart();
      this.existUser = !!localStorage.getItem('userData');
      this.isAdmin = JSON.parse(localStorage.getItem('userData')).role;
    });
  }

  ngOnInit(): void {
    this.itemsToCart = localStorage.getItem('items');
    if (this.itemsToCart != null)
      this.sharedService.itemsToCart.set(Number(this.itemsToCart));

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  homePage() {
    if (this.router.url == '/products' || this.firstWord != '')
      setTimeout(() => {
        window.location.reload();
      }, 1);
  }

  onAdmin() {
    if (this.firstWord != '') {
      setTimeout(() => {
        window.location.reload();
      }, 1);
    }
  }

  searchButton() {
    if (this.router.url != '/') {
      this.productsService.allProducts.set(this.filteredArray);
      if (this.router.url == '/admin/products') {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['products']);
      }
    } else {
      this.productsService.allProducts.set(this.filteredArray);
      window.scrollTo(0, 700);
    }
  }

  searchAutocomplete() {
    if (!this.searchInput) {
      this.options = [];
    }

    if (
      this.searchInput != undefined &&
      this.searchInput &&
      this.firstWord != Array.from(this.searchInput)[0]
    ) {
      this.productsAutocomplete = undefined;
      this.firstWord = Array.from(this.searchInput)[0];
      this.productsService.getNameItem(this.searchInput).subscribe((res) => {
        this.productsAutocomplete = res;
        this.options = [];
        for (let i = 0; i < this.productsAutocomplete.product.length; i++) {
          this.options.push(this.productsAutocomplete.product[i].title);
        }
      });
    } else if (this.productsAutocomplete) {
      const lowerCaseInput = this.searchInput?.toLowerCase();
      this.filteredArray = this.productsAutocomplete.product.filter(
        (product: any) => product.title.toLowerCase().includes(lowerCaseInput)
      );
    }
  }
  onLogout() {
    this.authService.logout();
  }

  onLogin() {
    this.sharedService.login.set(true);
  }
  onSignup() {
    this.sharedService.login.set(false);
  }
}
