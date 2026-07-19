import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';

import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TodoComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    FormsModule,
    TranslatePipe,
  ]
})
export class TodoModule { }
