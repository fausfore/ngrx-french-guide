import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListService } from '../../modules/todo-list/services/todo-list.service';

@Injectable()
export class TodoListEffects {
  // Listen les actions passées dans le Store
    @Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
    .pipe(
        // Si l'action est de type 'LOAD_INIT_TODOS' applique la suite sinon ne fait rien
        ofType(TodoListModule.ActionTypes.LOAD_INIT_TODOS),
        // l'action du switchMap est l'objet d'action qui est récupérer dans le ofType
        // action = { type: '[todoList] Load Init Todos' }
        switchMap(action => this.todoListService.getTodos()),
        // Dans le switchMap on éxécute le service et retournera le body dans le map suivant
        // todos = Todo[]
        // On a plus cas renvoyer une action SuccessInitTodos avec les todos en params
        map(todos => new TodoListModule.SuccessInitTodos(todos)),
        // Si le resolve n'a pas abouti il passe dans cette fonction
        // Qui renvoie l'action ErrorInitTodos
        catchError(() => of(new TodoListModule.ErrorInitTodos()))
    );

  constructor(
    private todoListService: TodoListService,
    private actions$: Actions
  ) {}
}
