import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListService } from '../../services/todo-list.service';

@Injectable()
export class TodoListEffects {
  // Listen les actions passées dans le Store
    @Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadInitTodos>(TodoListModule.ActionTypes.LOAD_INIT_TODOS),
          switchMap(action => this.todoListService.getTodos()),
          map(todos => new TodoListModule.SuccessInitTodos(todos)),
          catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
      );

    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadCreateTodo>(TodoListModule.ActionTypes.LOAD_CREATE_TODO),
          switchMap(action => this.todoListService.createTodo(action.payload)),
          map(todo => new TodoListModule.SuccessCreateTodo(todo)),
          catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
      );

    @Effect() LoadDeleteTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadDeleteTodo>(TodoListModule.ActionTypes.LOAD_DELETE_TODO),
          switchMap(action => this.todoListService.deleteTodo(action.payload)),
          map(id => new TodoListModule.SuccessDeleteTodo(id)),
          catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
      );

    @Effect() LoadUpdateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadUpdateTodo>(TodoListModule.ActionTypes.LOAD_UPDATE_TODO),
          switchMap(action => {
            const { id, ...changes } = action.payload;
            return this.todoListService.patchTodo(changes, id);
          }),
          map(todo => new TodoListModule.SuccessUpdateTodo(todo)),
          catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
      );

  constructor(
    private todoListService: TodoListService,
    private actions$: Actions
  ) {}
}
