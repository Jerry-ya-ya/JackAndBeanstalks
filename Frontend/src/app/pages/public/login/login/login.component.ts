import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { appPath } from '../../../../path/app-path-const';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  path = appPath; // 將 appPath 物件賦值給 path 屬性
  
  username = '';
  password = '';
  role = '';

  error = '';
  
  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('http://localhost:5000/api/login', {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        location.reload(); // 登入後刷新頁面
      },
      error: () => this.error = '登入失敗，請檢查帳號密碼'
    });
  }
}