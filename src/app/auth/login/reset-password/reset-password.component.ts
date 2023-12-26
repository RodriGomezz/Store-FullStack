import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgForm } from '@angular/forms';
import { SpinnerComponent } from 'src/app/components/shared/spinner/spinner.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  hide = true;
  error?: string;
  auth = {
    password: String,
    rePassword: String,
  };
  isLoading = false;
  loginButton = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(data: NgForm) {
    this.auth.rePassword = data.form.value.rePassword;
    this.isLoading = true;
    this.auth.password = data.form.value.password;

    if (this.auth.password === this.auth.rePassword) {
      this.authService
        .changePassword(this.router.url, this.auth.password)
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.error = 'Password has been changed  successfully!';
            this.loginButton = true;
          },
          error: (err) => {
            this.error = 'Token is invalid or has expired';
            this.isLoading = false;
          },
        });
    } else {
      this.isLoading = false;
      this.error = "Passwords doesn't match";
    }
  }

  goLogin() {
    this.router.navigate(['/auth']);
  }
}
