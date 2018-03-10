# Delete Todo V2

### *[Début de la branche step-9]*

Pour mettre à jour **DeleteTodo**, vous devez faire exactement la même chose que tout à l'heure.

*todo-list.action.ts*

```javascript
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
```javascript
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
```javascript
// [...]
deleteTodo(id: number) {
	this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
}
// [...]

```
Le serveur lors d'un **DELETE** nous renvoi aucune information pour palier à cela vous pouvez faire comme si dessous
Juste pour le service une petite astuce pour qu'il nous renvoie un id.

*todo-list.service.ts*
```javascript
// ... other
deleteTodo(id): Observable<number> {
    return this.http.delete<Todo>(`${environment.apiUrl}/todos/${id}`)
    // Le pipe va nous renvoyer l'id de la todo si la suppression
    // est réussi
      .pipe(map(response => id));
  }
// ... other

```
DeleteTodo Done !


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTEzNjg3NzIxMDIsMjI4OTA4NzY2XX0=
-->