import { Component } from '@angular/core';

import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-square',
  standalone: false,
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent implements OnInit {
  users: any[] = [];
  userId!: number;
  user: any;
  created_at: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  
  loadUser() {
    this.http.get<any>(`http://localhost:5000/api/me/public/${this.userId}`, { headers: this.headers })
    .subscribe(user => {
      this.user = user;
      this.created_at = user.created_at;
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();

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