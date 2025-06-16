import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  nickname = '';
  error = '';
  successMessage = '';

  constructor(private http: HttpClient) {}

  register() {
    this.http.post<any>('http://localhost:5000/api/register', {
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
      },
      error: err => {
        this.error = err.error.error || '註冊失敗';
      }
    });
  }
}