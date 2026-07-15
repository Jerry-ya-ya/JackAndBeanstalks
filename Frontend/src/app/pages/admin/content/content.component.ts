import { Component, OnInit } from '@angular/core';
import { CommunityNewsItem, HomeContentService, HomeNewsContent } from '../../../core/services/home-content.service';

type ContentSection = 'home-news' | 'member' | 'tutorial' | 'about' | 'system';

@Component({
  selector: 'app-content',
  standalone: false,
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
  activeSection: ContentSection = 'home-news';
  activeTheme: keyof HomeNewsContent = 'cmen';
  savedMessage = '';
  errorMessage = '';
  loading = false;
  saving = false;

  readonly sections: { key: ContentSection; label: string; hint: string; disabled?: boolean }[] = [
    { key: 'home-news', label: 'Home News', hint: 'Edit the homepage community cards.' },
    { key: 'member', label: 'Member', hint: 'Reserved for public member content.', disabled: true },
    { key: 'tutorial', label: 'Tutorial', hint: 'Reserved for tutorial page assets.', disabled: true },
    { key: 'about', label: 'About', hint: 'Reserved for about page copy.', disabled: true },
    { key: 'system', label: 'System', hint: 'Reserved for global content switches.', disabled: true }
  ];

  content: HomeNewsContent;

  constructor(private homeContent: HomeContentService) {
    this.content = this.homeContent.getContentSnapshot();
  }

  ngOnInit() {
    this.loading = true;
    this.homeContent.loadAdminContent().subscribe({
      next: content => {
        this.content = content;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.error || 'Failed to load homepage news.';
        this.loading = false;
      }
    });
  }

  get activeNews(): CommunityNewsItem[] {
    return this.content[this.activeTheme];
  }

  setSection(section: ContentSection) {
    const target = this.sections.find(item => item.key === section);
    if (target?.disabled) {
      return;
    }

    this.activeSection = section;
  }

  setTheme(theme: keyof HomeNewsContent) {
    this.activeTheme = theme;
    this.savedMessage = '';
  }

  addNewsItem() {
    this.activeNews.push({
      title: 'New Update',
      summary: 'Write the news summary here.',
      tag: 'News'
    });
    this.savedMessage = '';
  }

  removeNewsItem(index: number) {
    if (this.activeNews.length <= 1) {
      return;
    }

    this.activeNews.splice(index, 1);
    this.savedMessage = '';
  }

  moveNewsItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.activeNews.length) {
      return;
    }

    const [item] = this.activeNews.splice(index, 1);
    this.activeNews.splice(targetIndex, 0, item);
    this.savedMessage = '';
  }

  save() {
    this.saving = true;
    this.savedMessage = '';
    this.errorMessage = '';

    this.homeContent.saveAdminContent(this.content).subscribe({
      next: content => {
        this.content = content;
        this.savedMessage = 'Homepage news saved to database.';
        this.saving = false;
      },
      error: error => {
        this.errorMessage = error?.error?.error || 'Failed to save homepage news.';
        this.saving = false;
      }
    });
  }

  reset() {
    this.content = this.homeContent.getDefaultContent();
    this.savedMessage = 'Defaults loaded. Save to publish them.';
    this.errorMessage = '';
  }
}
