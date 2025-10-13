import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFriends();
    this.loadRequests();
  }

  // followFriend() {
  //   if (!this.friendUsername.trim()) return;

  //   this.apiService.post<any>(
  //     '/friends/follow',
  //     { friend_username: this.friendUsername },
  //     this.apiService.createAuthHeaders()
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
    this.apiService.delete<any>(
      `/friends/remove/${friendId}`,
      this.apiService.createAuthHeaders()
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
    this.apiService.get<any[]>(
      '/friends/list',
      this.apiService.createAuthHeaders()
    ).subscribe(friends => this.friends = friends);
  }

  sendRequest() {
    this.apiService.post<any>(
      '/friends/request',
      { to_username: this.toUsername },
      this.apiService.createAuthHeaders()
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
    this.apiService.get<any[]>(
      '/friends/requests',
      this.apiService.createAuthHeaders()
    ).subscribe(res => this.requests = res);
  }

  acceptRequest(id: number) {
    this.apiService.post(
      `/friends/accept/${id}`,
      {},
      this.apiService.createAuthHeaders()
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
    this.apiService.post(
      `/friends/reject/${id}`,
      {},
      this.apiService.createAuthHeaders()
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