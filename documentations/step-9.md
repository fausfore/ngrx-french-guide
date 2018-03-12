# Delete Todo V2

### *[Début de la branche step-9]*

Pour mettre à jour **DeleteTodo**, faire exactement la même chose que la **step-8**.

*todo-list.action.ts*

```typescript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        // Delete Todo
        // DELETE_TODO = '[todoList] Delete Todo',
        LOAD_DELETE_TODO = '[todoList] Load Delete Todo',
        SUCCESS_DELETE_TODO = '[todoList] Success Delete Todo',
        ERROR_DELETE_TODO = '[todoList] Error Delete Todo'
        // [...]
    }

    // [...]

    // DELETE TODO
    /*
    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }
    */

    export class LoadDeleteTodo {
        readonly type = ActionTypes.LOAD_DELETE_TODO;
        constructor(public payload: number) {}
    }

    export class SuccessDeleteTodo {
        readonly type = ActionTypes.SUCCESS_DELETE_TODO;
        constructor(public payload: number) {}
    }
    
	export class ErrorDeleteTodo {
	    readonly type = ActionTypes.ERROR_DELETE_TODO;
	}

    export type Actions = LoadInitTodos
        // [...]
        | LoadDeleteTodo
        | ErrorDeleteTodo
        | SuccessDeleteTodo;
        // | DeleteTodo;

}

``` 
```typescript
// [...]
    // DELETE TODO

    case TodoListModule.ActionTypes.LOAD_DELETE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };
        
    case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        };
        
    /*
    case TodoListModule.ActionTypes.DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };

    */
// [...]
```
*all-todos.component.ts*
```typescript
// [...]
deleteTodo(id: number) {
	this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
}
// [...]

```
Le serveur, lors d'un **DELETE**, ne nous renvoie aucune information.
Pour y palier, faire comme ceci :

*todo-list.service.ts*
```typescript
// [...]
deleteTodo(id): Observable<number> {
    return this.http.delete<Todo>(`${environment.apiUrl}/todos/${id}`)
    // Le pipe va nous renvoyer l'id de la todo si la suppression
    // est réussie
      .pipe(map(response => id));
  }
// [...]

```
Suppression terminée.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-10.md)


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQxODE3MTYwNiwyMjg5MDg3NjZdfQ==
-->