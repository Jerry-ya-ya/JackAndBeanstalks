import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface MemberContentItem {
  id?: number | null;
  name: string;
  role: string;
  githubUrl: string;
  sort_order?: number;
}

export const defaultMemberContent: MemberContentItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: null,
  name: 'Jerry-ya-ya',
  role: `Member Slot ${String(index + 1).padStart(2, '0')}`,
  githubUrl: 'https://github.com/Jerry-ya-ya',
  sort_order: index
}));

@Injectable({
  providedIn: 'root'
})
export class MemberContentService {
  private members = this.clone(defaultMemberContent);

  constructor(private apiService: ApiService) {}

  getSnapshot(): MemberContentItem[] {
    return this.clone(this.members);
  }

  loadPublicContent(): Observable<MemberContentItem[]> {
    return this.apiService.get<MemberContentItem[]>('/content/members').pipe(
      tap(members => this.members = this.normalizeMembers(members))
    );
  }

  loadAdminContent(): Observable<MemberContentItem[]> {
    return this.apiService.get<MemberContentItem[]>('/admin/content/members', this.apiService.createAuthHeaders()).pipe(
      tap(members => this.members = this.normalizeMembers(members))
    );
  }

  saveAdminContent(members: MemberContentItem[]): Observable<MemberContentItem[]> {
    return this.apiService.put<MemberContentItem[]>(
      '/admin/content/members',
      members,
      this.apiService.createAuthHeaders()
    ).pipe(
      tap(saved => this.members = this.normalizeMembers(saved))
    );
  }

  getDefaultContent(): MemberContentItem[] {
    return this.clone(defaultMemberContent);
  }

  normalizeMembers(items: unknown): MemberContentItem[] {
    if (!Array.isArray(items)) {
      return this.clone(defaultMemberContent);
    }

    const members = items.map((item, index) => {
      const member = item as Partial<MemberContentItem>;
      return {
        id: member.id ?? null,
        name: String(member.name ?? '').trim(),
        role: String(member.role ?? '').trim(),
        githubUrl: String(member.githubUrl ?? '').trim(),
        sort_order: Number(member.sort_order ?? index)
      };
    }).filter(member => member.name || member.role || member.githubUrl);

    return members.length ? members : this.clone(defaultMemberContent);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
