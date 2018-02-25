
## PATCH TODO

### Début de la branche step-10

Comme pour le **CreateTodo** et **DeleteTodo** = Same Shit !

*todo-list.action.ts*
```javascript
// ... other
export namespace TodoListModule {

    export enum ActionTypes {
        // ... other
        // UPDATE_TODO = '[todoList] Update Todo',
        LOAD_UPDATE_TODO = '[todoList] Load Update Todo',
        SUCCESS_UPDATE_TODO = '[todoList] Success Update Todo',
        ERROR_UPDATE_TODO = '[todoList] Error Update Todo',
        // ... other
    }
    // ... other
    // PATCH TODO
    /*
    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }
    */
    export class LoadUpdateTodo {
        readonly type = ActionTypes.LOAD_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessUpdateTodo {
        readonly type = ActionTypes.SUCCESS_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class ErrorUpdateTodo {
        readonly type = ActionTypes.ERROR_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    // ... other

    export type Actions = LoadInitTodos
        // ... other
        // | UpdateTodo
        | LoadUpdateTodo
        | ErrorUpdateTodo
        | SuccessUpdateTodo;

}

```
*todo-list.reducer.ts*
```javascript
// ... other
   // PATCH TODO
    /*
    case TodoListModule.ActionTypes.UPDATE_TODO:
        return {
            ...state,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        */

    case TodoListModule.ActionTypes.LOAD_UPDATE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        return {
            ...state,
            loading: false,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        
     case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        }
// ... other
```
Le nouveau effect: 

*todo-list.effect.ts*
```javascript
// ... other
 @Effect() LoadUpdateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadUpdateTodo>(TodoListModule.ActionTypes.LOAD_UPDATE_TODO),
          switchMap(action => {
            const { id, ...changes } = action.payload;
            return this.todoListService.patchTodo(changes, id);
          }),
          map(todo => new TodoListModule.SuccessUpdateTodo(todo)),
          catchError(() => of(new TodoListModule.ErrorCreateTodo()))
      );
```
On créer le service de path : 

*todo-list.service.ts*
```javascript
// ... other
patchTodo(changes: Partial<Todo>, id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${environment.apiUrl}/todos/${id}`, changes);
}
```
Et on change l'action dans le component: 

*select-todo.component.ts*
```javascript
// ... other
updateTodo(formValue) {
    console.log(formValue);
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.LoadUpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }
```

### Fin de la branche step-10

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIxOTk4NTcxOSwyNjk1ODY0ODddfQ==
-->