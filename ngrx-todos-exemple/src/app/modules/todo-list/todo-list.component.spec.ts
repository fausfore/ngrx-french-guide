import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { todoListRouting } from './todo-list.routing';
import { appRouting } from '../../app.routing';
import { AllTodosComponent } from './components/all-todos/all-todos.component';
import { SelectTodoComponent } from './components/select-todo/select-todo.component';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { REDUCER_TOKEN, getReducers } from '@StoreConfig';
import { StoreModule } from '@ngrx/store';
import * as FromTodoListModule from './todo-list.module';
import { StoreModuleApply } from '@StoreConfig';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FromTodoListModule.imports,
        appRouting,
        ToastrModule.forRoot(),
        ...StoreModuleApply.imports
      ],
      declarations: [
        ...FromTodoListModule.declarations
       ],
      providers: [
        ...StoreModuleApply.providers,
        { provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
