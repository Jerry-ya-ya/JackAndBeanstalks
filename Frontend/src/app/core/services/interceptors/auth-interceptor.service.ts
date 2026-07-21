import { Injectable, Injector } from '@angular/core';

import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private sessionExpiredSnackOpen = false;
  private readonly apiBaseUrl = environment.apiUrl.replace(/\/+$/, '');

  constructor(
    private router: Router,
    private injector: Injector,
    private translate: TranslateService
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const isBackendApiRequest = this.isBackendApiRequest(req.url);

    let authReq = req;
    
    if (token && isBackendApiRequest) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (isBackendApiRequest && error.status === 401 && !this.isLoginRequest(req.url)) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.openSessionExpiredSnack();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private isBackendApiRequest(url: string) {
    return url === this.apiBaseUrl || url.startsWith(`${this.apiBaseUrl}/`) || url.startsWith('/api/');
  }

  private isLoginRequest(url: string) {
    return url.split('?')[0].replace(/\/+$/, '').endsWith('/login');
  }

  private async openSessionExpiredSnack() {
    if (this.sessionExpiredSnackOpen) {
      return;
    }

    this.sessionExpiredSnackOpen = true;
    const { MatSnackBar } = await import('@angular/material/snack-bar');
    const snackBar = this.injector.get(MatSnackBar);

    snackBar.open(
      this.translate.instant('auth.feedback.sessionExpired'),
      this.translate.instant('login.feedback.dismiss'),
      {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['studio-snackbar', 'studio-snackbar-error']
      }
    ).afterDismissed().subscribe(() => {
      this.sessionExpiredSnackOpen = false;
    });
  }
}
