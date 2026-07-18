import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { forkJoin } from 'rxjs';

interface GithubProfile {
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  followers: number;
  following: number;
  html_url: string;
  location: string | null;
  login: string;
  name: string | null;
  public_repos: number;
}

interface GithubRepository {
  description: string | null;
  fork: boolean;
  html_url: string;
  language: string | null;
  name: string;
  stargazers_count: number;
  updated_at: string;
}

interface StudioMember {
  id: number;
  name: string;
  roleKey: string;
  githubUsername: string;
}

interface MemberCapability {
  labelKey: string;
  valueKey: string;
}

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './member.component.css'
})
export class MemberComponent implements OnInit {
  readonly demoMembers: StudioMember[] = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: 'Jerry-ya-ya',
    roleKey: `member.demoSlots.slot${String(index + 1).padStart(2, '0')}`,
    githubUsername: 'Jerry-ya-ya'
  }));

  readonly capabilities: MemberCapability[] = [
    { labelKey: 'member.capabilities.direction.label', valueKey: 'member.capabilities.direction.value' },
    { labelKey: 'member.capabilities.stack.label', valueKey: 'member.capabilities.stack.value' },
    { labelKey: 'member.capabilities.focus.label', valueKey: 'member.capabilities.focus.value' },
    { labelKey: 'member.capabilities.style.label', valueKey: 'member.capabilities.style.value' }
  ];

  selectedMember = this.demoMembers[0];
  profile: GithubProfile | null = null;
  repositories: GithubRepository[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadGithubProfile(this.selectedMember);
  }

  selectMember(member: StudioMember) {
    if (this.selectedMember.id === member.id && this.profile) {
      return;
    }

    this.selectedMember = member;
    this.loadGithubProfile(member);
  }

  loadGithubProfile(member = this.selectedMember) {
    this.loading = true;
    this.error = '';

    forkJoin({
      profile: this.http.get<GithubProfile>(`https://api.github.com/users/${member.githubUsername}`),
      repositories: this.http.get<GithubRepository[]>(
        `https://api.github.com/users/${member.githubUsername}/repos?sort=updated&per_page=8`
      )
    }).subscribe({
      next: ({ profile, repositories }) => {
        this.profile = profile;
        this.repositories = repositories.filter(repo => !repo.fork).slice(0, 6);
        this.loading = false;
      },
      error: () => {
        this.profile = this.getFallbackProfile(member);
        this.repositories = [];
        this.error = 'member.state.githubUnavailable';
        this.loading = false;
      }
    });
  }

  get displayName() {
    return this.profile?.name || this.selectedMember.name;
  }

  get profileBio() {
    return this.profile?.bio || '';
  }

  get profileBlog() {
    if (!this.profile?.blog) {
      return '';
    }

    return this.profile.blog.startsWith('http') ? this.profile.blog : `https://${this.profile.blog}`;
  }

  get profileUrl() {
    return `https://github.com/${this.selectedMember.githubUsername}`;
  }

  get memberAvatar() {
    return this.profile?.avatar_url || 'icons/cmenstudio.png';
  }

  private getFallbackProfile(member: StudioMember): GithubProfile {
    return {
      avatar_url: 'icons/cmenstudio.png',
      bio: null,
      blog: null,
      company: 'CMENStudio',
      followers: 0,
      following: 0,
      html_url: `https://github.com/${member.githubUsername}`,
      location: null,
      login: member.githubUsername,
      name: member.name,
      public_repos: 0
    };
  }
}
