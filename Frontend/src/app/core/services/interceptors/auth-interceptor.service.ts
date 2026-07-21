import { Injectable, Injector } from '@angular/core';

import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private sessionExpiredSnackOpen = false;

  constructor(
    private router: Router,
    private injector: Injector,
    private translate: TranslateService
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let authReq = req;
    
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/login')) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.openSessionExpiredSnack();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
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
