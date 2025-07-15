import { Component } from '@angular/core';
import { appPath } from '../../../path/app-path-const';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  path = appPath; // 將 appPath 物件賦值給 path 屬性

  collapsed = false;
  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    location.reload(); // 或導向登入頁
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
