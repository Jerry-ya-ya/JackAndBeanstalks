import { Component, ChangeDetectionStrategy } from '@angular/core';

//Tools
import { OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

// Models
import { Todo } from './todo.model';

interface ProjectTodoGroup {
  key: string;
  projectId: number | null;
  projectTitle: string;
  todos: Todo[];
  total: number;
  done: number;
}

@Component({
  selector: 'app-todo',
  standalone: false,
  templateUrl: './todo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  projectTodoGroups: ProjectTodoGroup[] = [];
  newTodoText: string = '';
  currentUserId: number | null = null;
  
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchTodos();
  }

  // C
  // 新增待辦事項
  addTodo() {
    if (!this.newTodoText.trim()) return;
    this.apiService.post<Todo>('/todos', { text: this.newTodoText }, this.apiService.createAuthHeaders())
      .subscribe(todo => {
        this.setTodos([...this.todos, todo]);
        this.newTodoText = '';
      });
  }
  
  // R
  // 取得所有待辦事項
  fetchTodos() {
    const headers = this.apiService.createAuthHeaders();

    forkJoin({
      assignedTodos: this.apiService.get<Todo[]>('/todos', headers),
      createdTodos: this.apiService.get<Todo[]>('/todos?created_by_me=true', headers),
      currentUser: this.apiService.get<{ id: number }>('/me', headers),
    }).subscribe(({ assignedTodos, createdTodos, currentUser }) => {
        this.currentUserId = currentUser.id;
        this.setTodos(this.mergeTodos(assignedTodos, createdTodos));
      });
  }
  
  // U
  // 更新待辦事項
  toggleClaim(todo: Todo) {
    this.apiService.put<Todo>(`/todos/${todo.id}`, {
      text: todo.text,
      claimed: !todo.claimed_by_id,
      priority: todo.priority
    }, this.apiService.createAuthHeaders()).subscribe(updated => {
      this.setTodos(this.todos.map(item => item.id === updated.id ? updated : item));
    });
  }

  toggleDone(todo: Todo) {
    this.apiService.put<Todo>(`/todos/${todo.id}`, {
      text: todo.text,
      done: !todo.done,
      priority: todo.priority
    }, this.apiService.createAuthHeaders()).subscribe(updated => {
      this.setTodos(this.todos.map(item => item.id === updated.id ? updated : item));
    });
  }

  // D
  // 刪除待辦事項
  deleteTodo(id: number) {
    this.apiService.delete(`/todos/${id}`, this.apiService.createAuthHeaders())
      .subscribe(() => this.setTodos(this.todos.filter(t => t.id !== id)));
  }

  private setTodos(todos: Todo[]) {
    this.todos = todos;
    this.projectTodoGroups = this.buildProjectTodoGroups(todos);
  }

  private buildProjectTodoGroups(todos: Todo[]): ProjectTodoGroup[] {
    const groups = todos
      .filter(todo => !!todo.project_id || !!todo.project_title)
      .reduce<Record<string, { projectId: number | null; projectTitle: string; todos: Todo[] }>>((grouped, todo) => {
        const projectId = todo.project_id ?? null;
        const projectTitle = todo.project_title || 'Unsorted Project';
        const groupKey = `${projectId ?? 'none'}:${projectTitle}`;

        grouped[groupKey] ??= { projectId, projectTitle, todos: [] };
        grouped[groupKey].todos.push(todo);

        return grouped;
      }, {});

    return Object.entries(groups)
      .map(([key, group]) => ({
        key,
        projectId: group.projectId,
        projectTitle: group.projectTitle,
        todos: [...group.todos].sort((a, b) =>
          Number(a.done) - Number(b.done) ||
          this.getTodoPriority(a) - this.getTodoPriority(b) ||
          a.text.localeCompare(b.text)
        ),
        total: group.todos.length,
        done: group.todos.filter(todo => todo.done).length,
      }))
      .sort((a, b) =>
        a.projectTitle.localeCompare(b.projectTitle) ||
        Number(a.projectId ?? 0) - Number(b.projectId ?? 0)
      );
  }

  private mergeTodos(...todoLists: Todo[][]) {
    const merged = new Map<number, Todo>();

    for (const todo of todoLists.flat()) {
      merged.set(todo.id, todo);
    }

    return [...merged.values()].sort((a, b) =>
      Number(a.done) - Number(b.done) ||
      this.getTodoPriority(a) - this.getTodoPriority(b) ||
      (b.created_at || '').localeCompare(a.created_at || '') ||
      b.id - a.id
    );
  }

  getTodoPriority(todo: Todo) {
    return Math.min(9, Math.max(0, Number(todo.priority ?? 5)));
  }

  getPriorityColor(priority: number) {
    const level = Math.min(9, Math.max(0, Number(priority)));
    return `hsl(${(level / 9) * 120}, 78%, 46%)`;
  }

  getTodoClaimLabel(todo: Todo) {
    return todo.claimed_by_name ? `佔領：${todo.claimed_by_name}` : '未佔領';
  }

  canToggleClaim(todo: Todo) {
    return !todo.done && (!todo.claimed_by_id || todo.claimed_by_id === this.currentUserId);
  }
}
