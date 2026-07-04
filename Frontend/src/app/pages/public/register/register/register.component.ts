import { Component } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { appPath } from '../../../../path/app-path-const';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  path = appPath;
  username = '';
  password = '';
  email = '';
  nickname = '';
  error = '';
  successMessage = '';
  submitting = false;
  
  constructor(private apiService: ApiService) {}

  register() {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.post<any>('/register', {
      username: this.username,
      password: this.password,
      email: this.email,
    }).subscribe({
      next: res => {
        this.successMessage = '註冊成功！請至信箱點擊驗證連結';
        this.username = '';
        this.password = '';
        this.email = '';
        this.error = '';
        this.submitting = false;
      },
      error: err => {
        this.error = err.error.error || '註冊失敗';
        this.submitting = false;
      }
    });
  }
}
