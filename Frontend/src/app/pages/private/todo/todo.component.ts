import { Component } from '@angular/core';

//Tools
import { OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

// Models
import { Todo } from './todo.model';

interface ProjectTodoGroup {
  projectTitle: string;
  todos: Todo[];
  total: number;
  done: number;
}

@Component({
  selector: 'app-todo',
  standalone: false,
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoText: string = '';
  
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
        this.todos.push(todo);
        this.newTodoText = '';
      });
  }
  
  // R
  // 取得所有待辦事項
  fetchTodos() {
    this.apiService.get<Todo[]>('/todos', this.apiService.createAuthHeaders())
      .subscribe(data => this.todos = data);
  }
  
  // U
  // 更新待辦事項
  toggleDone(todo: Todo) {
    this.apiService.put<Todo>(`/todos/${todo.id}`, {
      text: todo.text,
      done: !todo.done,
      priority: todo.priority
    }, this.apiService.createAuthHeaders()).subscribe(updated => todo.done = updated.done);
  }

  // D
  // 刪除待辦事項
  deleteTodo(id: number) {
    this.apiService.delete(`/todos/${id}`, this.apiService.createAuthHeaders())
      .subscribe(() => this.todos = this.todos.filter(t => t.id !== id));
  }

  get projectTodoGroups(): ProjectTodoGroup[] {
    const groups = this.todos
      .filter(todo => !!todo.project_title)
      .reduce<Record<string, Todo[]>>((grouped, todo) => {
        const projectTitle = todo.project_title || 'Unsorted Project';
        grouped[projectTitle] = [...(grouped[projectTitle] || []), todo];
        return grouped;
      }, {});

    return Object.entries(groups)
      .map(([projectTitle, todos]) => ({
        projectTitle,
        todos: [...todos].sort((a, b) =>
          Number(a.done) - Number(b.done) ||
          this.getTodoPriority(a) - this.getTodoPriority(b) ||
          a.text.localeCompare(b.text)
        ),
        total: todos.length,
        done: todos.filter(todo => todo.done).length,
      }))
      .sort((a, b) => a.projectTitle.localeCompare(b.projectTitle));
  }

  getTodoPriority(todo: Todo) {
    return Math.min(9, Math.max(0, Number(todo.priority ?? 5)));
  }

  getPriorityColor(priority: number) {
    const level = Math.min(9, Math.max(0, Number(priority)));
    return `hsl(${(level / 9) * 120}, 78%, 46%)`;
  }
}
