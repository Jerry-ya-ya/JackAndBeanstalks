import { Component, ChangeDetectionStrategy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-setting',
  standalone: false,
  templateUrl: './setting.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  oldPassword = '';
  newPassword = '';
  passwordMessage = '';
  isSuccessMessage = false;
  submitting = false;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

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
        this.passwordMessage = this.translate.instant('privateSetting.feedback.passwordSuccess');
        this.isSuccessMessage = true;
        this.oldPassword = '';
        this.newPassword = '';
        this.submitting = false;
      },
      error: (err) => {
        this.passwordMessage = err.error.error || this.translate.instant('privateSetting.feedback.passwordFailure');
        this.isSuccessMessage = false;
        this.submitting = false;
      }
    });
  }
}
