import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productDetails: any;
  public productSelected = signal<any>({});
  public allProducts = signal({});

  constructor(private http: HttpClient) {
    effect(() => {
      const data = this.productSelected();
    });
  }

  getItems(pageSize: Number) {
    return this.http.get(`${environment.UrlUser}/products?page=${pageSize}`);
  }

  getNameItem(searchAutocomplete: string) {
    return this.http.get(
      `${environment.UrlUser}/productsAutocomplete?searchInput=${searchAutocomplete}`
    );
  }

  getItemsPagination(skip: any, limit: any, category: any) {
    return this.http.get(
      `${environment.UrlUser}/productsPagination?page=${skip}&limit=${limit}&category=${category}`
    );
  }

  getItemsForCategory(category: any, limit: any) {
    return this.http.get(
      `${environment.UrlUser}/productsCategory?category=${category}&limit=${limit}`
    );
  }

  shareProductDetails(data: any) {
    this.productDetails = data;
  }

  getProductDetails() {
    return this.productDetails;
  }

  ProductSelectedSignal(item: any) {
    this.productSelected.set(item);
  }

  getProductByRoute(item: any) {
    return this.http.post(`${environment.UrlUser}/selectedProductUrl`, {
      item,
    });
  }

  buyItems(userEmail, direction, items, totalPrice) {
    return this.http.post(`${environment.UrlUser}/buyItems`, {
      userEmail,
      direction,
      items,
      totalPrice,
    });
  }
}
