import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public showNavBarService = signal(true);
  public itemsToCart = signal(0);
  public ProductToCart = signal({});
  public login = signal(false);
  constructor() {}
}
