# Delete Todo V2

### *[Début de la branche step-9]*

Comme pour le **CreateTodo** = Same Shit !

Les actions :
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
        // ...Other
    }

    // ... Other

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
        // ... other
        | LoadDeleteTodo
        | ErrorDeleteTodo
        | SuccessDeleteTodo;
        // | DeleteTodo;

}

``` 
Créer les reducers correspondante: 
```javascript
// ... Other
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
// ... Other
```
Modifier l'action passé dans le template :

*all-todos.component.ts*
```javascript
// ... other
deleteTodo(id: number) {
	this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
}
// ... other

```
Et créer le service delete Todo, pour renvoyer l'id lors de la requête, on lui ajoute un pipe qui renvoie l'id du paramètre si 200

*todo-list.service.ts*
```javascript
// ... other
deleteTodo(id): Observable<number> {
    return this.http.delete<Todo>(`${environment.apiUrl}/todos/${id}`)
    // Le pipe va nous renvoyer l'id de la todo si la suppression
    // est réussi
      .pipe(
        map((response) => id)
      );
  }
// ... other

```
Voilà pour la suppression.

### Fin de la branche step-9

<!--stackedit_data:
eyJoaXN0b3J5IjpbNzEyMTQzNTc0LDIyODkwODc2Nl19
-->