import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminProductsService {
  private productDetails: any;
  public productSelected = signal<any>({});
  public allProducts = signal({});

  constructor(private http: HttpClient) {
    effect(() => {
      const data = this.productSelected();
    });
  }

  getItems(pageSize: Number) {
    return this.http.get(
      `${environment.UrlAdmin}/adminProducts?page=${pageSize}`
    );
  }

  editDataBase(item: any) {
    return this.http.put(`${environment.UrlAdmin}/editDataBase`, item);
  }
  deleteItemService(item: any) {
    return this.http.put(`${environment.UrlAdmin}/deleteItem`, { item });
  }

  disableItemService(_id: number, active: string) {
    return this.http.put(`${environment.UrlAdmin}/disableItem`, {
      _id,
      active,
    });
  }

  addProductService(item: any) {
    return this.http.post(`${environment.UrlAdmin}/addProduct`, item);
  }

  getItemsPagination(skip: any, limit: any, category: any) {
    return this.http.get(
      `${environment.UrlAdmin}/productsPagination?page=${skip}&limit=${limit}&category=${category}`
    );
  }

  getBoughtItems() {
    return this.http.get(`${environment.UrlAdmin}/getBoughtItems`);
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
}
