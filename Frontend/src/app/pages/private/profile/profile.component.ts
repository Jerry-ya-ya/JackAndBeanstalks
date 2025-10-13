import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  // email, nickname
  user: any = null;
  editing = false;
  success = '';
  mode = 'login'; // 預設為登入
  public environment = environment;
  public apiRoot: string = environment.apiUrl.replace('/api', '');

  constructor(private http: HttpClient) {}
  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    location.reload();  // 或導向登入頁
  }

  ngOnInit() {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
      // 取得使用者資料
      this.http.get<any>(`${environment.apiUrl}/me`, { headers }).subscribe({
        next: (data) => {
          this.user = data;
          console.log('載入 user 成功', this.user);
        },
        error: (err) => {
          if (err.status === 401) {
            // Token 無效才登出
            this.logout();
          } else {
            // 其他錯誤：只記錄錯誤，不登出
            console.error('取得使用者資料失敗：', err);
          }
        }
      });
    }
  }

  loadProfile() {
    this.http.get<any>(`${environment.apiUrl}/me`).subscribe({
      next: data => {
        this.user = data;
      },
      error: () => alert('取得個人資料失敗')
    });
  }

  saveProfile() {
    this.http.put(`${environment.apiUrl}/me`, {
      email: this.user.email,
      nickname: this.user.nickname
    }).subscribe({
      next: () => {
        this.success = '資料已更新！';
        this.editing = false;
      },
      error: () => alert('更新失敗')
    });
  }

  // 上傳頭像
  avatarPreview: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.avatarPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar() {
    if (!this.selectedFile) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>(`${environment.apiUrl}/avatar`, formData, { headers }).subscribe({
      next: res => {
        this.user.avatar_url = res.avatar_url;
        this.avatarPreview = null;
        alert('頭像上傳成功');
      },
      error: () => alert('上傳失敗')
    });
  }
}