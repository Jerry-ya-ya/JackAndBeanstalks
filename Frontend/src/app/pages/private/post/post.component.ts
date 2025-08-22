import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  content: string = '';
  posts: any[] = [];
  user: any = null;
  message = '';

  public environment = environment;
  public apiRoot: string = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}

  get headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit(): void {
    this.loadMyPosts();
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>(`${environment.apiUrl}/me`).subscribe({
      next: data => {
        this.user = data;
      },
      error: () => alert('取得個人資料失敗')
    });
  }

  loadMyPosts() {
    this.http.get<any[]>(`${environment.apiUrl}/post/me`, this.headers)
      .subscribe(data => this.posts = data);
  }

  submitPost() {
    this.http.post<any>(`${environment.apiUrl}/post`, { content: this.content }, this.headers)
      .subscribe({
        next: res => {
          this.message = res.message;
          this.content = '';
          this.loadMyPosts();
        },
        error: err => {
          this.message = err.error?.error || '發文失敗';
        }
      });
  }
}
