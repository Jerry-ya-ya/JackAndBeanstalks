import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { HomeContentService } from '../../../core/services/home-content.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly cmenSubtitle = ['Computing', 'Mathematics', 'Engineering', 'Network'];
  readonly edenSubtitle = ['Encode', 'Develop', 'Enlighten', 'Nexus'];

  constructor(
    public theme: ThemeService,
    private homeContent: HomeContentService
  ) {}

  ngOnInit() {
    this.homeContent.loadPublicContent().subscribe({
      error: error => console.error('Failed to load homepage news:', error)
    });
  }

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
    return this.homeContent.getNews(this.isNightMode ? 'eden' : 'cmen');
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
