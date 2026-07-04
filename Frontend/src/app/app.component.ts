import { Component } from '@angular/core';
import { appPath } from './path/app-path-const';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'jackandbeanstalks';
  path = appPath;

  constructor(public theme: ThemeService) {}
}
