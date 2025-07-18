import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-friend',
  standalone: false,
  templateUrl: './friend.component.html',
  styleUrl: './friend.component.css'
})
export class FriendComponent implements OnInit {
  friendUsername: string = '';
  message: string = '';
  friends: any[] = [];

  toUsername: string = '';
  requests: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFriends();
    this.loadRequests();
  }

  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // followFriend() {
  //   if (!this.friendUsername.trim()) return;

  //   this.http.post<any>(
  //     'http://localhost:5000/api/friends/follow',
  //     { friend_username: this.friendUsername },
  //     { headers: this.headers }
  //   ).subscribe({
  //     next: res => {
  //       this.message = res.message;
  //       this.friendUsername = '';
  //       this.loadFriends();
  //     },
  //     error: err => {
  //       this.message = err.error?.error || '發生錯誤';
  //     }
  //   });
  // }

  removeFriend(friendId: number) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.delete<any>(
      `http://localhost:5000/api/friends/remove/${friendId}`,
      { headers }
    ).subscribe({
      next: res => {
        this.message = res.message;
        this.loadFriends(); // 重新載入清單
      },
      error: err => {
        this.message = err.error?.error || '刪除失敗';
      }
    });
  }

  loadFriends() {
    this.http.get<any[]>(
      'http://localhost:5000/api/friends/list',
      { headers: this.headers }
    ).subscribe(friends => this.friends = friends);
  }

  sendRequest() {
    this.http.post<any>(
      'http://localhost:5000/api/friends/request',
      { to_username: this.toUsername },
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.message = res.message;
        this.toUsername = '';
      },
      error: err => {
        this.message = err.error?.error || '發送失敗';
      }
    });
  }

  loadRequests() {
    this.http.get<any[]>(
      'http://localhost:5000/api/friends/requests',
      { headers: this.headers }
    ).subscribe(res => this.requests = res);
  }

  acceptRequest(id: number) {
    this.http.post(
      `http://localhost:5000/api/friends/accept/${id}`,
      {},
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.message = (res as any).message;
        this.loadRequests();
      },
      error: err => {
        this.message = err.error?.error || '接受失敗';
      }
    });
  }

  rejectRequest(id: number) {
    this.http.post(
      `http://localhost:5000/api/friends/reject/${id}`,
      {},
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.message = (res as any).message;
        this.loadRequests();
      },
      error: err => {
        this.message = err.error?.error || '拒絕失敗';
      }
    });
  }
}