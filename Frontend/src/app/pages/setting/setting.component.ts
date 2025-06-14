import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-setting',
  standalone: false,
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  oldPassword = '';
  newPassword = '';
  passwordMessage = '';

  constructor(private http: HttpClient) {}

  changePassword() {
    this.http.put('http://localhost:5000/api/changepassword', {
      old_password: this.oldPassword,
      new_password: this.newPassword
    }).subscribe({
      next: () => {
        this.passwordMessage = '密碼修改成功';
        this.oldPassword = '';
        this.newPassword = '';
      },
      error: (err) => {
        this.passwordMessage = err.error.error || '修改失敗';
      }
    });
  }
}