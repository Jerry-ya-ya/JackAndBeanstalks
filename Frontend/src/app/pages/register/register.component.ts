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

  constructor(private http: HttpClient) {}

  register() {
    this.http.post<any>('http://localhost:5000/api/register', {
      username: this.username,
      password: this.password,
      email: this.email,
      nickname: this.nickname,
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.access_token);
        location.reload();
      },
      error: err => {
        this.error = err.error.error || '註冊失敗';
      }
    });
  }
}