import { Component, ChangeDetectionStrategy } from '@angular/core';
import { appPath } from './path/app-path-const';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'jackandbeanstalks';
  path = appPath;
  readonly languages = [
    { code: 'zh-TW', label: '繁中', name: 'Traditional Chinese' },
    { code: 'en', label: 'EN', name: 'English' }
  ];
  currentLanguage = localStorage.getItem('language') || 'zh-TW';
  languageMenuOpen = false;
  private worldPointerStartX = 0;
  private worldPointerMoved = false;
  private suppressWorldClick = false;

  constructor(
    public theme: ThemeService,
    private translate: TranslateService
  ) {
    this.translate.use(this.currentLanguage);
  }

  beginWorldSlide(event: PointerEvent) {
    this.worldPointerStartX = event.clientX;
    this.worldPointerMoved = false;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  moveWorldSlide(event: PointerEvent) {
    if (Math.abs(event.clientX - this.worldPointerStartX) > 8) {
      this.worldPointerMoved = true;
    }
  }

  finishWorldSlide(event: PointerEvent) {
    if (!this.worldPointerMoved) {
      return;
    }

    const control = event.currentTarget as HTMLElement;
    const rect = control.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    this.theme.setWorldMode(ratio >= 0.5);
    this.suppressWorldClick = true;
  }

  toggleWorldFromClick(event: MouseEvent) {
    if (this.suppressWorldClick) {
      event.preventDefault();
      this.suppressWorldClick = false;
      return;
    }

    this.theme.toggleWorldMode();
  }

  switchLanguage(language: string) {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    this.translate.use(language);
    this.languageMenuOpen = false;
  }

  toggleLanguageMenu() {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  get currentLanguageLabel() {
    return this.languages.find(language => language.code === this.currentLanguage)?.label || '繁中';
  }
}
