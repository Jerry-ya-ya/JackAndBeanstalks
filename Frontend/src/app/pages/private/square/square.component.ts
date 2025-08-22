import { Component } from '@angular/core';

import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

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
  posts: any[] = [];
  created_at: string = '';
  
  public environment = environment;
  public apiRoot: string = environment.apiUrl.replace('/api', '');

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadPosts() {
    this.http.get<any[]>(`${environment.apiUrl}/post/user/${this.userId}`, { headers: this.headers })
      .subscribe(res => this.posts = res);
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPosts();

    // 取得使用者資料
    this.http.get<any[]>(`${environment.apiUrl}/square`, {headers}).subscribe({
      next: data => {
        this.users = data;
        console.log('載入 user 成功', this.users);
      },
      error: () => alert('無法取得使用者資料')
    });
  }
}