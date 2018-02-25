# Create Todo V2

### *[Début de la branche step-8]*

Maintenant on va modifié notre action de **CreateTodo** pour inclure une requête serveur de la même façon comme précédemment avec **InitTodos** donc au lieu s'avoir que une action **CREATE_TODO**, on aura :
- **LOAD_CREATE_TODO** ,
- **SUCCESS_CREATE_TODO**,
 - **ERROR_CREATE_TODO**.

*todo-list.action.ts*
```javascript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
	    // ... Other
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // CREATE_TODO = '[todoList] Create Todo',
    }
	// ... Other
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
    // ... Other
    export type Actions = DeleteTodo
        | LoadCreateTodo
        | SuccessCreateTodo
        | ErrorCreateTodo
        // ... Other
        //| CreateTodo;
}

```
On inclus les nouvelles actions dans le reducer.
```javascript
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
        // Passe le loading a true
        return {
            ...state,
            loading: false,
            data: [
                ...state.data,
                action.payload
            ]
        };

    case TodoListModule.ActionTypes.ERROR_CREATE_TODO:
        // Passe le loading a true
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

    // ...Other

    default:
        return state;
    }
}

```
On créer un service de post: 
```javascript
// ... Other
@Injectable()
export class TodoListService {

 // ... Other

  createTodo(body): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}/todos`, body);
  }

}
```
On ajoute un effect qui écoutera les actions de type **LOAD_CREATE_TODO**.

```javascript
// ...Other

@Injectable()
export class TodoListEffects {
  // ...Other

    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadCreateTodo>(TodoListModule.ActionTypes.LOAD_CREATE_TODO),
          switchMap(action => this.todoListService.createTodo(action.payload)),
          map(todo => new TodoListModule.SuccessCreateTodo(todo)),
          catchError(() => of(new TodoListModule.ErrorInitTodos()))
      );

// ...Other
}
```
Maintenant reste plus que a changer l'action lors du clique ainsi on peut retirer la notion d'id car le serveur donnera son propre id à la todo.
*all-todos.ts*
```javascript
// private todosLength: number;
// ... Other
this.todos$ = store
      .pipe(
        select(selectTodos$),
        /*tap((todos) => {
          console.log('selectTodos', todos);
          this.todosLength = todos.length;
        }) */
    );
// ... Other
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
Voilà notre création de todo est terminée.
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA5NDc3MDU0NiwtMTUwOTk3NDQ5NF19
-->