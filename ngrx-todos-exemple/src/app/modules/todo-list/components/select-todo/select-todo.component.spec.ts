import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTodoComponent } from './select-todo.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { REDUCER_TOKEN, getReducers, StoreModuleApply } from '@StoreConfig';
import { StoreModule } from '@ngrx/store';
import { appRouting } from '../../../../app.routing';
import { todoListRouting } from '../../todo-list.routing';
import { APP_BASE_HREF } from '@angular/common';
import { TodoListComponent } from '../../todo-list.component';
import { AllTodosComponent } from '../all-todos/all-todos.component';
import * as FromTodoListModule from '../../todo-list.module';

describe('SelectTodoComponent', () => {
  let component: SelectTodoComponent;
  let fixture: ComponentFixture<SelectTodoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...FromTodoListModule.imports,
        ...StoreModuleApply.imports,
        appRouting,
      ],
      declarations: [
        ...FromTodoListModule.declarations
      ],
      providers: [
        ...StoreModuleApply.providers,
        { provide: APP_BASE_HREF, useValue: '/'},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
