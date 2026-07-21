import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { appPath } from '../../../path/app-path-const';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  path = appPath; // 將 appPath 物件賦值給 path 屬性

  collapsed = true;

  constructor(
    private router: Router,
    private injector: Injector,
    private translate: TranslateService
  ) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.collapsed = true;
    this.openLogoutSnack();
    this.router.navigate([appPath.login]);
  }

  private async openLogoutSnack() {
    const { MatSnackBar } = await import('@angular/material/snack-bar');
    const snackBar = this.injector.get(MatSnackBar);

    snackBar.open(
      this.translate.instant('login.feedback.logoutSuccess'),
      this.translate.instant('login.feedback.dismiss'),
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['studio-snackbar', 'studio-snackbar-success']
      }
    );
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  isAdmin() {
    return localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superadmin';
  }

  isSuperadmin() {
    return localStorage.getItem('role') === 'superadmin';
  }
}
