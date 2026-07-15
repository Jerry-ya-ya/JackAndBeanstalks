import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../../core/services/api.service';
import { appPath } from '../../../../path/app-path-const';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  path = appPath; // 將 appPath 物件賦值給 path 屬性
  
  username = '';
  password = '';
  role = '';

  error = '';
  submitting = false;
  
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login() {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    this.error = '';

    this.apiService.post<any>('/login', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        this.router.navigate([appPath.userhome]);
      },
      error: () => {
        this.error = '登入失敗，請檢查帳號密碼';
        this.submitting = false;
      }
    });
  }
}
