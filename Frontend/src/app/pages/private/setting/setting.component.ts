import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  isSuccessMessage = false;
  submitting = false;

  constructor(private http: HttpClient) {}

  changePassword() {
    if (this.submitting) {
      return;
    }

    this.submitting = true;
    this.passwordMessage = '';
    this.isSuccessMessage = false;

    this.http.put(`${environment.apiUrl}/changepassword`, {
      old_password: this.oldPassword,
      new_password: this.newPassword
    }).subscribe({
      next: () => {
        this.passwordMessage = '密碼修改成功';
        this.isSuccessMessage = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.submitting = false;
      },
      error: (err) => {
        this.passwordMessage = err.error.error || '修改失敗';
        this.isSuccessMessage = false;
        this.submitting = false;
      }
    });
  }
}
