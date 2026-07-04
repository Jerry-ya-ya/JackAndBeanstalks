import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  isNightMode = true;
  remainingSeconds = 300;

  private readonly cycleSeconds = 300;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.syncBodyTheme();
    this.startWorldTimer();
  }

  get nextModeLabel() {
    return this.isNightMode ? 'CMEN DAY' : 'EDEN NIGHT';
  }

  get countdownLabel() {
    const minutes = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  toggleWorldMode() {
    this.isNightMode = !this.isNightMode;
    this.remainingSeconds = this.cycleSeconds;
    this.syncBodyTheme();
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private startWorldTimer() {
    if (this.timerId) {
      return;
    }

    this.timerId = setInterval(() => {
      this.remainingSeconds -= 1;

      if (this.remainingSeconds <= 0) {
        this.toggleWorldMode();
      }
    }, 1000);
  }

  private syncBodyTheme() {
    this.document.body.classList.toggle('eden-night-theme', this.isNightMode);
    this.document.body.classList.toggle('cmen-day-theme', !this.isNightMode);
  }
}
