import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  name: string;
  email: string;
  token: string;
  role: string;
  expiresIn: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signInService(email: StringConstructor, password: StringConstructor) {
    return this.http
      .post<AuthResponseData>(`${environment.UrlUser}/login`, {
        email,
        password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(
            resData.name,
            resData.email,
            resData.id,
            resData.role,
            resData.token,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    name: string,
    email: string,
    id: string,
    role: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(name, email, id, role, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  signUpService(
    name: StringConstructor,
    email: StringConstructor,
    password: StringConstructor
  ) {
    return this.http
      .post<AuthResponseData>(`${environment.UrlUser}/signup`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(
            resData.name,
            resData.email,
            resData.id,
            resData.role,
            resData.token,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      name: string;
      email: string;
      id: string;
      role: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.name,
      userData.email,
      userData.id,
      userData.role,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    location.reload();
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  resetPassword(email: string) {
    return this.http.post(`${environment.UrlUser}/forgotPassword`, { email });
  }
  changePassword(url: string, password: StringConstructor) {
    return this.http.post(`${environment.UrlUser}${url}`, { password });
  }
}
