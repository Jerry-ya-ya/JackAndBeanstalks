import { Component } from '@angular/core';

//Tools
import { OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

// Models
import { Todo } from './todo.model';

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
      done: !todo.done
    }, this.apiService.createAuthHeaders()).subscribe(updated => todo.done = updated.done);
  }

  // D
  // 刪除待辦事項
  deleteTodo(id: number) {
    this.apiService.delete(`/todos/${id}`, this.apiService.createAuthHeaders())
      .subscribe(() => this.todos = this.todos.filter(t => t.id !== id));
  }
}