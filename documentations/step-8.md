# Create Todo version 2

### *[Début de la branche step-8]*

Mettre à jour notre action de **createTodo** pour inclure une requête serveur de la même façon que **InitTodos**.
 Il n'y aura pas une action **CREATE_TODO**, mais trois :
- **LOAD_CREATE_TODO** ;
- **SUCCESS_CREATE_TODO** ;
 - **ERROR_CREATE_TODO**.

*todo-list.action.ts*
```typescript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
	    // [...]
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // CREATE_TODO = '[todoList] Create Todo',
    }
	// [...]
	/*
    export class CreateTodo {
        readonly type = ActionTypes.CREATE_TODO;
        constructor(public payload: Todo) {}
    }
    */

    export class LoadCreateTodo {
        readonly type = ActionTypes.LOAD_CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessCreateTodo {
        readonly type = ActionTypes.SUCCESS_CREATE_TODO;
        constructor(public payload: Todo) {}
    }
    
    export class ErrorCreateTodo {
        readonly type = ActionTypes.ERROR_CREATE_TODO;
    }
    // [...]
    export type Actions = DeleteTodo
        | LoadCreateTodo
        | SuccessCreateTodo
        | ErrorCreateTodo
        // [...]
        //| CreateTodo;
}

```
Ajouter les nouvelles actions dans le *reducer* :
```typescript
// ...Other
todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

  switch (action.type) {

	// ...Other
    case TodoListModule.ActionTypes.LOAD_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_CREATE_TODO:
        // Passe le loading a false et ajoute une todo
        return {
            ...state,
            loading: false,
            data: [
                ...state.data,
                action.payload
            ]
        };

    case TodoListModule.ActionTypes.ERROR_CREATE_TODO:
        // Passe le loading a false
        return {
            ...state,
            loading: false
        };

	/*
    case TodoListModule.ActionTypes.CREATE_TODO:
        return {
            ...state,
            data: [
                ...state.data,
                action.payload
            ]
        };
     */

    // [...]

    default:
        return state;
    }
}

```
Créer un service de post : 
```typescript
// [...]
@Injectable()
export class TodoListService {

 // [...]

  createTodo(body): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}/todos`, body);
  }

}
```
Ajouter l'*effect* qui écoutera les actions de type **LOAD_CREATE_TODO** :

```typescript
// [...]
@Injectable()
export class TodoListEffects {
  // [...]
    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadCreateTodo>(TodoListModule.ActionTypes.LOAD_CREATE_TODO),
          switchMap(action => this.todoListService.createTodo(action.payload)),
          map(todo => new TodoListModule.SuccessCreateTodo(todo)),
          catchError(() => of(new TodoListModule.ErrorInitTodos()))
      );

// [...]
}
```
Changer l'action lors du clique.
Ainsi, on peut retirer la notion d'*id* car le serveur définira son propre *id* à la *todo* :

*all-todos.ts*
```typescript
// private todosLength: number;
// [...]
this.todos$ = store
      .pipe(
        select(selectTodos$),
        /*tap((todos) => {
          console.log('selectTodos', todos);
          this.todosLength = todos.length;
        }) */
    );
// [...]
createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
      // id: this.todosLength + 1
    };
    // this.store.dispatch(new TodoListModule.CreateTodo(payload));
    this.store.dispatch(new TodoListModule.LoadCreateTodo(payload));
    this.todoForm.reset();
  }
```
L'action de **createTodo** est maintenant connectée avec le serveur.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-9.md)


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTUxMDA0NDU0MCwtMTUwOTk3NDQ5NF19
-->