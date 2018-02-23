import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTodosComponent } from './all-todos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { todoListRouting } from '../../todo-list.routing';
import { TodoListComponent } from '../../todo-list.component';
import { SelectTodoComponent } from '../select-todo/select-todo.component';
import { appRouting } from '../../../../app.routing';
import { APP_BASE_HREF } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { REDUCER_TOKEN, getReducers, StoreModuleApply } from '@StoreConfig';
import * as FromTodoListModule from '../../todo-list.module';
import * as FromAppModule from '../../../../app.module';

describe('AllTodosComponent', () => {
  let component: AllTodosComponent;
  let fixture: ComponentFixture<AllTodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...FromAppModule.imports,
        ...FromTodoListModule.imports,
        appRouting,
        ...StoreModuleApply.imports
      ],
      declarations: [
        ...FromAppModule.declarations,
        ...FromTodoListModule.declarations
      ],
      providers: [
        ...FromAppModule.providers,
        { provide: APP_BASE_HREF, useValue: '/'},
        ...StoreModuleApply.providers
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
