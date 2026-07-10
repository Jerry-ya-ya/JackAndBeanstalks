import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  isNightMode = true;
  isWorldLocked = false;
  remainingSeconds = 300;

  private readonly cycleSeconds = 300;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.syncBodyTheme();
    this.startWorldTimer();
  }

  get nextModeLabel() {
    if (this.isWorldLocked) {
      return this.isNightMode ? 'EDEN LOCK' : 'CMEN LOCK';
    }

    return this.isNightMode ? 'CMEN DAY' : 'EDEN NIGHT';
  }

  get countdownLabel() {
    if (this.isWorldLocked) {
      return 'LOCKED';
    }

    const minutes = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get lockStateLabel() {
    return this.isWorldLocked ? 'ON' : 'OFF';
  }

  toggleWorldMode() {
    this.setWorldMode(!this.isNightMode);
  }

  setWorldMode(isNightMode: boolean) {
    if (this.isNightMode === isNightMode) {
      return;
    }

    this.isNightMode = isNightMode;
    this.remainingSeconds = this.cycleSeconds;
    this.syncBodyTheme();
  }

  toggleWorldLock() {
    this.isWorldLocked = !this.isWorldLocked;

    if (!this.isWorldLocked) {
      this.remainingSeconds = this.cycleSeconds;
    }
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
      if (this.isWorldLocked) {
        return;
      }

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
