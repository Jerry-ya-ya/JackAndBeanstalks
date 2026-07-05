import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

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
export class HomeComponent {
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

  constructor(public theme: ThemeService) {}

  get isNightMode() {
    return this.theme.isNightMode;
  }

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
}
