import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommunityNewsItem, HomeContentService, HomeNewsContent } from '../../../core/services/home-content.service';
import { MemberContentItem, MemberContentService, memberRoleOptions } from '../../../core/services/member-content.service';

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
  readonly memberRoleOptions = memberRoleOptions;

  readonly sections: { key: ContentSection; labelKey: string; hintKey: string; disabled?: boolean }[] = [
    { key: 'home-news', labelKey: 'adminContent.sections.homeNews.label', hintKey: 'adminContent.sections.homeNews.hint' },
    { key: 'member', labelKey: 'adminContent.sections.member.label', hintKey: 'adminContent.sections.member.hint' },
    { key: 'tutorial', labelKey: 'adminContent.sections.tutorial.label', hintKey: 'adminContent.sections.tutorial.hint', disabled: true },
    { key: 'about', labelKey: 'adminContent.sections.about.label', hintKey: 'adminContent.sections.about.hint', disabled: true },
    { key: 'system', labelKey: 'adminContent.sections.system.label', hintKey: 'adminContent.sections.system.hint', disabled: true }
  ];

  content: HomeNewsContent;
  members: MemberContentItem[];

  constructor(
    private homeContent: HomeContentService,
    private memberContent: MemberContentService,
    private translate: TranslateService
  ) {
    this.content = this.homeContent.getContentSnapshot();
    this.members = this.memberContent.getSnapshot();
  }

  ngOnInit() {
    this.loading = true;
    this.homeContent.loadAdminContent().subscribe({
      next: content => {
        this.content = content;
        this.loading = false;
      },
      error: error => {
        this.errorMessage = error?.error?.error || this.translate.instant('adminContent.feedback.loadFailure');
        this.loading = false;
      }
    });

    this.memberContent.loadAdminContent().subscribe({
      next: members => {
        this.members = members;
      },
      error: error => {
        this.errorMessage = error?.error?.error || this.translate.instant('adminContent.feedback.loadMemberFailure');
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
    this.savedMessage = '';
    this.errorMessage = '';
  }

  setTheme(theme: keyof HomeNewsContent) {
    this.activeTheme = theme;
    this.savedMessage = '';
  }

  addNewsItem() {
    this.activeNews.push({
      title: this.translate.instant('adminContent.defaults.newTitle'),
      summary: this.translate.instant('adminContent.defaults.newSummary'),
      tag: this.translate.instant('adminContent.defaults.newTag')
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

  addMember() {
    this.members.push({
      id: null,
      name: this.translate.instant('adminContent.member.defaults.name'),
      role: 'member',
      githubUrl: 'https://github.com/Jerry-ya-ya',
      sort_order: this.members.length
    });
    this.savedMessage = '';
  }

  removeMember(index: number) {
    if (this.members.length <= 1) {
      return;
    }

    this.members.splice(index, 1);
    this.savedMessage = '';
  }

  moveMember(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.members.length) {
      return;
    }

    const [item] = this.members.splice(index, 1);
    this.members.splice(targetIndex, 0, item);
    this.savedMessage = '';
  }

  save() {
    if (this.activeSection === 'member') {
      this.saveMembers();
      return;
    }

    this.saving = true;
    this.savedMessage = '';
    this.errorMessage = '';

    this.homeContent.saveAdminContent(this.content).subscribe({
      next: content => {
        this.content = content;
        this.savedMessage = this.translate.instant('adminContent.feedback.saveSuccess');
        this.saving = false;
      },
      error: error => {
        this.errorMessage = error?.error?.error || this.translate.instant('adminContent.feedback.saveFailure');
        this.saving = false;
      }
    });
  }

  saveMembers() {
    this.saving = true;
    this.savedMessage = '';
    this.errorMessage = '';

    const payload = this.members.map((member, index) => ({
      ...member,
      sort_order: index
    }));

    this.memberContent.saveAdminContent(payload).subscribe({
      next: members => {
        this.members = members;
        this.savedMessage = this.translate.instant('adminContent.feedback.saveMemberSuccess');
        this.saving = false;
      },
      error: error => {
        this.errorMessage = error?.error?.error || this.translate.instant('adminContent.feedback.saveMemberFailure');
        this.saving = false;
      }
    });
  }

  reset() {
    if (this.activeSection === 'member') {
      this.members = this.memberContent.getDefaultContent();
      this.savedMessage = this.translate.instant('adminContent.feedback.defaultsLoaded');
      this.errorMessage = '';
      return;
    }

    this.content = this.homeContent.getDefaultContent();
    this.savedMessage = this.translate.instant('adminContent.feedback.defaultsLoaded');
    this.errorMessage = '';
  }
}
