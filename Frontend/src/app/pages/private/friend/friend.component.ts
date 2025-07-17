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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  get headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  addFriend() {
    if (!this.friendUsername.trim()) return;

    this.http.post<any>(
      'http://localhost:5000/api/friends/add',
      { friend_username: this.friendUsername },
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.message = res.message;
        this.friendUsername = '';
        this.loadFriends();
      },
      error: err => {
        this.message = err.error?.error || '發生錯誤';
      }
    });
  }

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
}