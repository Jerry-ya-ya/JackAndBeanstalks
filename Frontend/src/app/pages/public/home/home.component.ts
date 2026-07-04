import { Component, OnDestroy, OnInit } from '@angular/core';
import { appPath } from '../../../path/app-path-const';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  path = appPath;
  isNightMode = true;
  remainingSeconds = 300;
  private readonly cycleSeconds = 300;
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly cmenSubtitle = ['Computing', 'Mathematics', 'Engineering', 'Network'];
  readonly edenSubtitle = ['Encode', 'Develop', 'Enlighten', 'Nexus'];

  get studioName() {
    return this.isNightMode ? 'EDEN' : 'CMENStudio';
  }

  get studioKicker() {
    return this.isNightMode ? 'Knowledge Network / Learning Lab' : 'Game Studio / Systems Lab';
  }

  get studioSubtitle() {
    return this.isNightMode ? this.edenSubtitle : this.cmenSubtitle;
  }

  get studioLogo() {
    return this.isNightMode ? 'icons/eden.png' : 'icons/cmenstudio.png';
  }

  get studioLogoAlt() {
    return `${this.studioName} logo`;
  }

  get nextModeLabel() {
    return this.isNightMode ? 'CMEN DAY' : 'EDEN NIGHT';
  }

  get countdownLabel() {
    const minutes = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.remainingSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  ngOnInit() {
    this.startWorldTimer();
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  toggleWorldMode() {
    this.isNightMode = !this.isNightMode;
    this.remainingSeconds = this.cycleSeconds;
  }

  private startWorldTimer() {
    this.timerId = setInterval(() => {
      this.remainingSeconds -= 1;

      if (this.remainingSeconds <= 0) {
        this.toggleWorldMode();
      }
    }, 1000);
  }
}
