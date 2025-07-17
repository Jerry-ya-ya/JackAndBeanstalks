import { Component } from '@angular/core';

//Tools
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  // C
  // 新增待辦事項
  addTodo() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    if (!this.newTodoText.trim()) return;
    this.http.post<Todo>('http://localhost:5000/api/todos', { text: this.newTodoText, headers })
      .subscribe(todo => {
        this.todos.push(todo);
        this.newTodoText = '';
      });
  }
  
  // R
  // 取得所有待辦事項
  fetchTodos() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    this.http.get<Todo[]>('http://localhost:5000/api/todos', { headers })
      .subscribe(data => this.todos = data);
  }
  
  // U
  // 更新待辦事項
  toggleDone(todo: Todo) {
    this.http.put<Todo>(`http://localhost:5000/api/todos/${todo.id}`, {
      text: todo.text,
      done: !todo.done
    }).subscribe(updated => todo.done = updated.done);
  }

  // D
  // 刪除待辦事項
  deleteTodo(id: number) {
    this.http.delete(`http://localhost:5000/api/todos/${id}`)
      .subscribe(() => this.todos = this.todos.filter(t => t.id !== id));
  }
}