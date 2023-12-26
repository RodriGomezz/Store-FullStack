import { Component, AfterViewInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { SharedService } from 'src/app/components/shared/shared.service';
import { SpinnerComponent } from 'src/app/components/shared/spinner/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    SpinnerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  hide = true;
  state = 'normal';
  login = false;
  signUp = true;
  auth = {
    name: String,
    email: String,
    password: String,
    rePassword: String,
  };
  userData?: any;
  isLoading?: boolean;
  error?: string;
  newPassword = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  errorNewPassword: any;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {
    effect(() => {
      this.login = !this.sharedService.login();
      this.signUp = !this.login;
    });
  }

  ngAfterViewInit(): void {
    this.sharedService.showNavBarService.set(false);
  }

  onSubmit(data: NgForm) {
    //login user
    if (data.form.value.rePassword === undefined) {
      this.isLoading = true;
      this.auth.email = data.form.value.email;
      this.auth.password = data.form.value.password;
      this.authService
        .signInService(this.auth.email, this.auth.password)
        .subscribe(
          (res) => {
            this.userData = res;
            this.isLoading = false;
            this.router.navigate(['/']);
          },
          (error) => {
            this.error = ' Incorrect email or password.';
            this.isLoading = false;
          }
        );
    } else {
      //register user
      this.auth.rePassword = data.form.value.rePassword;
      this.isLoading = true;
      this.auth.name = data.form.value.name;
      this.auth.email = data.form.value.email;
      this.auth.password = data.form.value.password;
      if (this.auth.password === this.auth.rePassword)
        this.authService
          .signUpService(this.auth.name, this.auth.email, this.auth.password)
          .subscribe(
            (res) => {
              this.userData = res;
              this.isLoading = false;
              this.router.navigate(['/']);
            },
            (error) => {
              this.error = 'An error ocurred';
              this.isLoading = false;
            }
          );
      else {
        this.isLoading = false;
        this.error = "passwords doesn't match";
      }
    }
  }

  //animation login and sing up
  onSign(device) {
    this.login = !this.login;
    if (device == 'desktop') {
      setTimeout(() => {
        this.signUp = !this.signUp;
      }, 1000);
    } else {
      this.signUp = !this.signUp;
    }
  }

  forgotPassword() {
    this.newPassword = !this.newPassword;
  }

  getNewPassword() {
    this.isLoading = true;
    this.authService.resetPassword(this.email.value).subscribe({
      next: (res) => {
        this.errorNewPassword = res;
        this.errorNewPassword = this.errorNewPassword.message;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorNewPassword = 'There is no user with email address';
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.sharedService.showNavBarService.set(true);
  }
}
