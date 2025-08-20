import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-resendverification',
  standalone: false,
  templateUrl: './resendverification.component.html',
  styleUrl: './resendverification.component.css'
})
export class ResendverificationComponent {
  email = '';
  message = '';
  error = '';
  constructor(private http: HttpClient) {}
  resend() {
    const apiBase = environment.apiUrl;
    this.http.post<any>(`${apiBase}/resendverification`, { email: this.email }).subscribe({
      next: res => {
        this.message = res.message;
        this.error = '';
      },
      error: err => {
        this.error = err.error.error || '寄送失敗';
        this.message = '';
      }
    });
  }
}
