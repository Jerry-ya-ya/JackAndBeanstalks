import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './post.component.css'
})
export class PostComponent {
  // 貼文內容
  content: string = '';
  // 貼文列表
  posts: any[] = [];
  // 使用者資料
  user: any = null;
  // 訊息
  message = '';
  // 編輯模式
  editMode: { [key: number]: boolean } = {};
  editContent: { [key: number]: string } = {};
  // 環境變數
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

  getAvatarInitial(user: any) {
    return (user?.nickname || user?.username || '?').charAt(0).toUpperCase();
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

  enableEdit(post: any) {
    this.editMode[post.id] = true;
    this.editContent[post.id] = post.content;
  }
  
  cancelEdit(postId: number) {
    this.editMode[postId] = false;
  }
  
  updatePost(postId: number) {
    const newContent = this.editContent[postId];
    this.http.put(`${environment.apiUrl}/post/${postId}`, { content: newContent }, this.headers)
      .subscribe({
        next: res => {
          this.message = (res as any).message;
          this.editMode[postId] = false;
          this.loadMyPosts();
        },
        error: err => {
          this.message = err.error?.error || '更新失敗';
        }
      });
  }
  
  deletePost(postId: number) {
    if (!confirm('確定要刪除這篇貼文？')) return;
  
    this.http.delete(`${environment.apiUrl}/post/${postId}`, this.headers)
      .subscribe({
        next: res => {
          this.message = (res as any).message;
          this.loadMyPosts();
        },
        error: err => {
          this.message = err.error?.error || '刪除失敗';
        }
      });
  }
}
