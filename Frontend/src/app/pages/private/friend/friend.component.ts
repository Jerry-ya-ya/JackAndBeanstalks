import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-friend',
  standalone: false,
  templateUrl: './friend.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './friend.component.css'
})
export class FriendComponent implements OnInit {
  friendUsername: string = '';
  message: string = '';
  friends: any[] = [];

  toUsername: string = '';
  requests: any[] = [];

  constructor(
    private apiService: ApiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.refreshFriendPage();
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
        this.message = err.error?.error || this.translate.instant('privateFriend.feedback.removeFailure');
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
        this.message = err.error?.error || this.translate.instant('privateFriend.feedback.sendFailure');
      }
    });
  }

  loadRequests() {
    this.apiService.get<any[]>(
      '/friends/requests',
      this.apiService.createAuthHeaders()
    ).subscribe(res => this.requests = res);
  }

  refreshFriendPage() {
    this.loadFriends();
    this.loadRequests();
  }

  acceptRequest(id: number) {
    this.apiService.post(
      `/friends/accept/${id}`,
      {},
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: res => {
        this.message = (res as any).message;
        this.refreshFriendPage();
      },
      error: err => {
        this.message = err.error?.error || this.translate.instant('privateFriend.feedback.acceptFailure');
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
        this.message = err.error?.error || this.translate.instant('privateFriend.feedback.rejectFailure');
      }
    });
  }
}
