import { Component } from '@angular/core';

import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-square',
  standalone: false,
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    // 取得使用者資料
    this.http.get<any[]>('http://localhost:5000/api/square', {headers}).subscribe({
      next: data => {
        this.users = data;
        console.log('載入 user 成功', this.users);
      },
      error: () => alert('無法取得使用者資料')
    });
  }
}