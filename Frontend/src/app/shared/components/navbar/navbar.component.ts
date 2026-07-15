import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.collapsed = true;
    this.router.navigate([appPath.login]);
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
