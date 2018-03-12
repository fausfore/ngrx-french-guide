# Les action de type ERROR

### *[Début de la branche step-11]*
Dans notre code, on remarque que les actions d'erreurs réalisent la même tâche.
Dans ce cas, il n'y a qu'une seule action à définir :

*todo-list.action.ts*
```typescript
// [...]
export namespace TodoListModule {

    export enum ActionTypes {
	    // [...]
        // ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // ERROR_UPDATE_TODO = '[todoList] Error Update Todo',
        // ERROR_DELETE_TODO = '[todoList] Error Delete Todo',
        // ERROR_INIT_TODOS = '[todoList] Error Init Todos',
        // Error request Todos
        ERROR_LOAD_ACTION = '[todoList] Error Load Action'
    }

	// [...]
    /*
    export class ErrorInitTodos {
        readonly type = ActionTypes.ERROR_INIT_TODOS;
    }
    // [...]
    /*
    export class ErrorCreateTodo {
        readonly type = ActionTypes.ERROR_CREATE_TODO;
    }
    */
	// [...]
    /*
    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }
    */
	// [...]
    /*
    export class ErrorUpdateTodo {
        readonly type = ActionTypes.ERROR_UPDATE_TODO;
    }
    */

    // [...]
    
    /*
    export class ErrorDeleteTodo {
        readonly type = ActionTypes.ERROR_DELETE_TODO;
    }
    */

    // ERROR ACTIONS

    export class ErrorLoadAction {
        readonly type = ActionTypes.ERROR_LOAD_ACTION;
    }

    export type Actions = LoadInitTodos
        // [...]
        // | ErrorInitTodos
        // | ErrorCreateTodo
        // | ErrorUpdateTodo
        // | ErrorDeleteTodo

}

```
*todo-list.reducer.ts*
```typescript
// ... other
  switch (action.type) {

    // [...]
    /*
    case TodoListModule.ActionTypes.ERROR_INIT_TODOS:
        // Error rend le loading a false
        return {
            ...state,
            loading: false
        };*/

    // ... other
    /*
    case TodoListModule.ActionTypes.ERROR_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: false
        };*/

    // ... other
    /*
    case TodoListModule.ActionTypes.UPDATE_TODO:
        return {
            ...state,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        */

    // [...]
    /*
    case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        };*/


    // [...]
    /*
    case TodoListModule.ActionTypes.ERROR_DELETE_TODO:
        return {
            ...state,
            loading: false
        };*/

    case TodoListModule.ActionTypes.ERROR_LOAD_ACTION:
        return {
            ...state,
            loading: false
        };

    // [...]
}

```
*todo-list.effect.ts*
```typescript
// ... other
@Injectable()
export class TodoListEffects {
  // Ecoute les actions passées dans le store
    @Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // [...]
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // [...]
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadDeleteTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // [...]
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadUpdateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
      // [...]
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );
  // [...]
}

```
## Système de logs

Une fois le code inutile supprimé, on mettra en place un système de logs avec des *toasters* afin d'informer l'utilisateur en cas de changement ou d'erreur dans le state.
Le **catchError** peut prendre une **erreur Http** en argument, on peut donc l'a récupérer pour notre state :

*todo-list.effect.ts*
```typescript
// [...]
catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
```
*todo-list.action.ts*
```typescript
import { HttpErrorResponse } from '@angular/common/http';
// [...]
export class ErrorLoadAction {
    readonly type = ActionTypes.ERROR_LOAD_ACTION;
    constructor(public payload: HttpErrorResponse) {}
}
```

Ajouter une autre propriété *logs* dans l'interface du state :

*models/todo.ts*
```typescript
export interface TodoListState {
    // ... other
    logs: {
        type: string;
        message: string;
    };
}
```
Ajouter cette propriété dans le *reducer* : 

*todo-list.reducer.ts*
```typescript
const initialState: TodoListState = {
    // [...]
    logs: undefined
};

case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload),
            logs: { type: 'SUCCESS', message: 'La todo a été supprimée avec succès' }
        };

case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        return {
            ...state,
            loading: false,
            logs: { type: 'SUCCESS', message: 'La todo a été mise à jour avec succès' },
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };

case TodoListModule.ActionTypes.SUCCESS_CREATE_TODO:
     return {
         ...state,
         logs: { type: 'SUCCESS', message: 'La todo a été créée avec succès' },
         data: [
             ...state.data,
             action.payload
         ]
     };
        
case TodoListModule.ActionTypes.ERROR_LOAD_ACTION:
    return {
        ...state,
        loading: false,
        logs: { type: 'ERROR', message: action.payload.message },
    };
```
Créer un sélecteur pour le *log* : 

*todo-list.selector.ts*
```typescript
export const selectTodosErrors$ =
    createSelector(selectTodoListState$, (todos) => todos.logs);
```
Installer le module [ngx-toastr](https://github.com/scttcper/ngx-toastr).
 Une fois que tout sera installer, aller dans le **TodoListComponent** :

```typescript
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppState } from '@StoreConfig';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectTodosErrors$ } from '@Selectors/todo-list.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  template: `
	  <header>
		  <nav>
			  <a routerLink="all-todos" routerLinkActive="active">all todos</a>
			  <a routerLink="select-todo" routerLinkActive="active">select todo</a>
		  </nav>
	  </header>
	  <router-outlet></router-outlet>
  `,
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  public todoListErrors$: Observable<any>;

  constructor(
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {
    this.todoListErrors$ = store.pipe(
      select(selectTodosErrors$),
      tap((dialog) => {
        if (!dialog) {
          return;
        }
        if (dialog.type === 'ERROR') {
          this.toastr.error(dialog.message);
        } else {
          this.toastr.success(dialog.message);
        }
        console.log(dialog);
      })
    );
    this.todoListErrors$.subscribe();
  }

}

```
Le système de *log* est maintenant fonctionnel.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-12.md)



<!--stackedit_data:
eyJoaXN0b3J5IjpbNjE5OTg0NTg3LC05NTI5NTg4OF19
-->