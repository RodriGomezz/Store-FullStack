import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth/auth.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './auth/login/login.component';
import { ProductsComponent } from './components/home/products/products.component';
import { ResetPasswordComponent } from './auth/login/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'cart',
    component: ShoppingCartComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'resetPassword/:id',
    component: ResetPasswordComponent,
  },
  {
    path: 'product/:id/:id',
    loadComponent: () =>
      import('./components/products-details/products-details.component').then(
        (mod) => mod.ProductsDetailsComponent
      ),
  },
  {
    path: 'admin/products',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './components/home/admin/sidenav/admin-products/admin-products.component'
      ).then((mod) => mod.AdminProductsComponent),
  },
  {
    path: 'admin/users',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/home/admin/sidenav/users/users.component').then(
        (mod) => mod.UsersComponent
      ),
  },
  {
    path: 'admin/sales',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/home/admin/sidenav/sales/sales.component').then(
        (mod) => mod.SalesComponent
      ),
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
