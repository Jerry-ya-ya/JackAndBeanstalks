import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { appPath } from '../../../path/app-path-const';

interface CommunityNewsItem {
  title: string;
  summary: string;
  tag: string;
}

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
  readonly cmenNews: CommunityNewsItem[] = [
    {
      title: 'Prototype Lab Opens',
      summary: 'A small corner for gameplay sketches, tiny tools, and strange experiments.',
      tag: 'Studio'
    },
    {
      title: 'Player Notes Wanted',
      summary: 'Collecting first impressions before the next round of game-facing polish.',
      tag: 'Community'
    },
    {
      title: 'Devlog Queue',
      summary: 'Future posts will track builds, experiments, and useful lessons from production.',
      tag: 'Devlog'
    }
  ];
  readonly edenNews: CommunityNewsItem[] = [
    {
      title: 'Knowledge Node Online',
      summary: 'EDEN prepares a shared space for questions, references, and learning trails.',
      tag: 'Network'
    },
    {
      title: 'Learning Routes Drafted',
      summary: 'Encode, Develop, Enlighten, and Nexus will shape the first content channels.',
      tag: 'Roadmap'
    },
    {
      title: 'Admin News Tools Planned',
      summary: 'Community news cards are placeholders until editable publishing is unlocked.',
      tag: 'System'
    }
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

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

  get communityNews() {
    return this.isNightMode ? this.edenNews : this.cmenNews;
  }

  get communityNewsTitle() {
    return this.isNightMode ? 'EDEN Community News' : 'CMENStudio Community News';
  }

  get communityNewsIntro() {
    return this.isNightMode
      ? 'Updates from the learning network, prepared for future admin publishing.'
      : 'Studio notes for players, makers, and future game development updates.';
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
    this.syncBodyTheme();
    this.startWorldTimer();
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.document.body.classList.remove('eden-night-theme', 'cmen-day-theme');
  }

  toggleWorldMode() {
    this.isNightMode = !this.isNightMode;
    this.remainingSeconds = this.cycleSeconds;
    this.syncBodyTheme();
  }

  private startWorldTimer() {
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
