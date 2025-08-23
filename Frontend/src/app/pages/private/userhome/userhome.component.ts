import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-userhome',
  standalone: false,
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent {
  posts: any[] = [];
  users: any[] = [];
  
  loading = true;
  error = false;
  errorMessage = '';

  public environment = environment;
  public apiRoot: string = environment.apiUrl.replace('/api', '');
  
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadAllUsers() {
    console.log('Loading all users');
    
    this.http.get<any[]>(`${environment.apiUrl}/square`, { headers: this.headers })
      .subscribe({
        next: (usersData) => {
          console.log('Users data received:', usersData);
          this.users = usersData;
          this.loadAllPosts();
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.error = true;
          this.errorMessage = `載入用戶資料失敗: ${err.status} - ${err.error?.error || err.message || '未知錯誤'}`;
          this.loading = false;
        }
      });
  }

  loadAllPosts() {
    console.log('Loading all posts');
    
    this.http.get<any[]>(`${environment.apiUrl}/post`, { headers: this.headers })
      .subscribe({
        next: (postsData) => {
          console.log('Posts data received:', postsData);
          this.posts = postsData;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load posts:', err);
          this.error = true;
          this.errorMessage = `載入貼文失敗: ${err.status} - ${err.error?.error || err.message || '未知錯誤'}`;
          this.loading = false;
        }
      });
  }

  // 根據用戶 ID 獲取用戶資料
  getUserById(userId: number): any {
    return this.users.find(user => user.id === userId);
  }

  ngOnInit(): void {
    console.log('UserHome component initialized - loading all users and posts');
    this.loadAllUsers();
  }
}