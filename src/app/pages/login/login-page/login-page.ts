import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastComponent } from '../../../shared/components/toast-component/toast-component';
import { Login } from '../login';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  constructor(
    private readonly service: Login,
    private readonly route: Router
  ) {}
  userEmail = '';
  userPass = '';
  showPassword = false;
  loading = false;
  viewToast = false;
  toastMessage = '';
  isToastSuccess = true;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  showToast(message: string, isSuccess: boolean = true) {
    this.toastMessage = message;
    this.isToastSuccess = isSuccess;
    this.viewToast = true;
    setTimeout(() => {
      this.viewToast = false;
    }, 2500);
  }

  onSubmit() {
    if (this.loading) return;
    this.loading = true;
    this.service.checkLogin(this.userEmail, this.userPass).subscribe({
      next: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.showToast('Login successful!', true);
        setTimeout(() => {
          this.route.navigate(['/dashboard']);
        }, 800);
      },
      error: (err) => {
        this.showToast('Login failed. Please check your credentials.', false);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
