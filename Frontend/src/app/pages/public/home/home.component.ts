import { Component } from '@angular/core';
import { appPath } from '../../../path/app-path-const';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  path = appPath;
  isNightMode = true;

  toggleWorldMode() {
    this.isNightMode = !this.isNightMode;
  }
}
