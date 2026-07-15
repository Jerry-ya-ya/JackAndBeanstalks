import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

interface ProjectRecruitmentMember {
  id: number;
  message?: string;
  created_at?: string;
  user: {
    id: number;
    username: string;
    nickname?: string;
    avatar_url?: string;
    role?: string;
  };
}

interface ProjectRecruitment {
  id: number;
  title: string;
  summary: string;
  role_needed?: string;
  contact?: string;
  max_members?: number;
  created_at?: string;
  creator: {
    id: number;
    username: string;
    nickname?: string;
    avatar_url?: string;
    role?: string;
  };
  members: ProjectRecruitmentMember[];
  member_count: number;
  joined_by_me: boolean;
  owned_by_me: boolean;
}

@Component({
  selector: 'app-project-recruitment',
  standalone: false,
  templateUrl: './project-recruitment.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-recruitment.component.css'
})
export class ProjectRecruitmentComponent implements OnInit {
  projects: ProjectRecruitment[] = [];
  loading = false;
  submitting = false;
  deletingProject: Record<number, boolean> = {};
  actionLoading: Record<number, boolean> = {};
  todoLoading: Record<number, boolean> = {};
  todoTexts: Record<number, string> = {};
  todoTargets: Record<number, string> = {};
  todoPriorities: Record<number, number> = {};
  joinMessages: Record<number, string> = {};
  statusMessage = '';
  joinMessage = '';

  form = {
    title: '',
    summary: '',
    role_needed: '',
    contact: '',
    max_members: null as number | null,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.apiService.get<ProjectRecruitment[]>('/project-recruitments', this.apiService.createAuthHeaders())
      .subscribe({
        next: projects => {
          this.projects = projects;
          this.loading = false;
        },
        error: err => {
          this.statusMessage = err.error?.error || '無法載入專案招募';
          this.loading = false;
        }
      });
  }

  createProject() {
    if (!this.form.title.trim() || !this.form.summary.trim() || this.submitting) {
      return;
    }

    this.submitting = true;
    this.apiService.post<ProjectRecruitment>(
      '/project-recruitments',
      this.form,
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: project => {
        this.projects = [project, ...this.projects];
        this.form = {
          title: '',
          summary: '',
          role_needed: '',
          contact: '',
          max_members: null,
        };
        this.statusMessage = '招募已建立';
        this.submitting = false;
      },
      error: err => {
        this.statusMessage = err.error?.error || '建立招募失敗';
        this.submitting = false;
      }
    });
  }

  joinProject(project: ProjectRecruitment) {
    if (project.owned_by_me || project.joined_by_me || this.actionLoading[project.id]) {
      return;
    }

    this.actionLoading[project.id] = true;
    this.apiService.post<ProjectRecruitment>(
      `/project-recruitments/${project.id}/join`,
      { message: this.joinMessages[project.id] || '' },
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: updated => {
        this.replaceProject(updated);
        this.joinMessages[project.id] = '';
        this.actionLoading[project.id] = false;
      },
      error: err => {
        this.statusMessage = err.error?.error || '登記加入失敗';
        this.actionLoading[project.id] = false;
      }
    });
  }

  leaveProject(project: ProjectRecruitment) {
    if (!project.joined_by_me || this.actionLoading[project.id]) {
      return;
    }

    this.actionLoading[project.id] = true;
    this.apiService.delete<ProjectRecruitment>(
      `/project-recruitments/${project.id}/join`,
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: updated => {
        this.replaceProject(updated);
        this.actionLoading[project.id] = false;
      },
      error: err => {
        this.statusMessage = err.error?.error || '取消登記失敗';
        this.actionLoading[project.id] = false;
      }
    });
  }

  deleteProject(project: ProjectRecruitment) {
    if (!project.owned_by_me || this.deletingProject[project.id]) {
      return;
    }

    this.deletingProject[project.id] = true;
    this.apiService.delete<{ message: string; id: number }>(
      `/project-recruitments/${project.id}`,
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: result => {
        this.projects = this.projects.filter(item => item.id !== result.id);
        delete this.deletingProject[project.id];
        this.statusMessage = '招募已刪除';
      },
      error: err => {
        this.statusMessage = err.error?.error || '刪除招募失敗';
        delete this.deletingProject[project.id];
      }
    });
  }

  publishTodo(project: ProjectRecruitment) {
    const text = (this.todoTexts[project.id] || '').trim();
    const target = this.todoTargets[project.id] || 'team';
    const priority = this.getTodoPriority(project.id);

    if (!project.owned_by_me || !text || this.todoLoading[project.id]) {
      return;
    }

    const payload: {
      text: string;
      project_id: number;
      priority: number;
      assign_to_team?: boolean;
      assignee_user_id?: number;
    } = {
      text,
      project_id: project.id,
      priority,
    };

    if (target === 'team') {
      payload.assign_to_team = true;
    } else if (target === 'captain') {
      payload.assignee_user_id = project.creator.id;
    } else {
      payload.assignee_user_id = Number(target);
    }

    this.todoLoading[project.id] = true;
    this.apiService.post(
      '/todos',
      payload,
      this.apiService.createAuthHeaders()
    ).subscribe({
      next: () => {
        this.todoTexts[project.id] = '';
        this.todoTargets[project.id] = 'team';
        this.todoPriorities[project.id] = 5;
        delete this.todoLoading[project.id];
        this.statusMessage = 'Todo 已發布';
      },
      error: err => {
        this.statusMessage = err.error?.error || '發布 Todo 失敗';
        delete this.todoLoading[project.id];
      }
    });
  }

  getTodoPriority(projectId: number) {
    const priority = Number(this.todoPriorities[projectId] ?? 5);
    return Math.min(9, Math.max(0, priority));
  }

  getPriorityColor(priority: number) {
    const level = Math.min(9, Math.max(0, Number(priority)));
    return `hsl(${(level / 9) * 120}, 78%, 46%)`;
  }

  isFull(project: ProjectRecruitment) {
    return !!project.max_members && project.member_count >= project.max_members;
  }

  get ownedProjects() {
    return this.projects.filter(project => project.owned_by_me);
  }

  private replaceProject(updated: ProjectRecruitment) {
    this.projects = this.projects.map(project => project.id === updated.id ? updated : project);
  }
}
