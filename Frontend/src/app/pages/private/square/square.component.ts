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
  user: any;
  userId!: number;
  currentUserId: number | null = null;
  friendIds = new Set<number>();
  friendMessages: Record<number, string> = {};
  friendActionLoading: Record<number, boolean> = {};
  
  public environment = environment;
  public apiRoot: string = environment.apiUrl.replace('/api', '');

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  
  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
    
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    // 取得使用者資料
    this.http.get<any[]>(`${environment.apiUrl}/square`, {headers}).subscribe({
      next: data => {
        this.users = data;
        console.log('載入 user 成功', this.users);
      },
      error: () => alert('無法取得使用者資料')
    });

    this.loadFriends();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.http.get<any>(`${environment.apiUrl}/me`, { headers: this.headers }).subscribe({
      next: user => {
        this.currentUserId = user.id;
      },
      error: () => {
        console.error('無法取得目前使用者');
      }
    });
  }

  loadFriends() {
    this.http.get<any[]>(`${environment.apiUrl}/friends/list`, { headers: this.headers }).subscribe({
      next: friends => {
        this.friendIds = new Set(friends.map(friend => friend.id));
      },
      error: () => {
        console.error('無法取得好友列表');
      }
    });
  }

  isFriend(userId: number) {
    return this.friendIds.has(userId);
  }

  isCurrentUser(userId: number) {
    return this.currentUserId === userId;
  }

  getAvatarInitial(user: any) {
    return (user?.nickname || user?.username || '?').charAt(0).toUpperCase();
  }

  sendFriendRequest(user: any) {
    if (!user?.username || this.isCurrentUser(user.id) || this.friendActionLoading[user.id]) {
      return;
    }

    this.friendActionLoading[user.id] = true;
    this.http.post<any>(
      `${environment.apiUrl}/friends/request`,
      { to_username: user.username },
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.friendMessages[user.id] = res.message || '已發送邀請';
        this.friendActionLoading[user.id] = false;
      },
      error: err => {
        this.friendMessages[user.id] = err.error?.error || '發送失敗';
        this.friendActionLoading[user.id] = false;
      }
    });
  }

  removeFriend(user: any) {
    if (!user?.id || this.isCurrentUser(user.id) || this.friendActionLoading[user.id]) {
      return;
    }

    this.friendActionLoading[user.id] = true;
    this.http.delete<any>(
      `${environment.apiUrl}/friends/remove/${user.id}`,
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.friendIds.delete(user.id);
        this.friendMessages[user.id] = res.message || '已刪除好友';
        this.friendActionLoading[user.id] = false;
      },
      error: err => {
        this.friendMessages[user.id] = err.error?.error || '刪除失敗';
        this.friendActionLoading[user.id] = false;
      }
    });
  }
}
