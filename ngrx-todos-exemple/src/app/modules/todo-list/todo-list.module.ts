import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { SelectTodoComponent } from './components/select-todo/select-todo.component';
import { AllTodosComponent } from './components/all-todos/all-todos.component';
import { todoListRouting } from './todo-list.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    todoListRouting,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [TodoListComponent, SelectTodoComponent, AllTodosComponent]
})

export class TodoListModule { }
