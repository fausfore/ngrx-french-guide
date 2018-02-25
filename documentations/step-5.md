# Select & Update Todo

### *[Début de la branche step-5]*

On va rajouter un propriété dans le **TodoListState** afin de conservé une todo, on va modifier l'interface, les actions et le reducer pour pouvoir ajouter cette logique.

*models/todo.ts*
```javascript
export interface TodoListState {
	// ... other
	selectTodo: Todo
}
```
On ajoute directement un **SELECT** & un **UPDATE** toutes ces actions auront un paramètre de type Todo.

*store/actions/todo-list.action.ts*
```javascript
export namespace TodoListModule {
	export enum ActionTypes {
		// ... other
		SELECT_TODO = '[todoList] Select Todo',
		UPDATE_TODO = '[todoList] Update Todo'
	}
	// ... other
	export class SelectTodo {
		readonly type = ActionTypes.SELECT_TODO;
		constructor(payload: Todo){}
	}
	
	export class UpdateTodo {
		readonly type = ActionTypes.UPDATE_TODO;
		constructor(payload: Todo){}
	}
	// ... other
	export type Actions = InitTodos
	| SelectTodo
	| DeleteTodo;
}
```
**SelectTodo** va juste récupérer le contenu du payload et l'**UpdateTodo** va changer la todo qui match avec l'id de la todo du paylaod.
*/store/reducers/todo-list.reducer.ts*
```javascript
import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list';

const initialState: TodoListState = {
	// ... other
	selectTodo: undefined
};

export function todosReducer(
// ... other

    case TodoListModule.ActionTypes.SELECT_TODO:
	    return {
			...state,
			selectTodo: action.payload
		};
		
	case TodoListModule.ActionTypes.UPDATE_TODO:
	    return {
			...state,
			data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
			})
		};
	
		
// ... other      
```
Il faut ajouté l'action **SelectTodo** au clique aui dispatchera une action et redirigera vers la page de **select-todo**

*all-todos.ts*
```javascript
// ... Other
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-todos',
  styleUrls: ['./all-todos.component.scss'],
  template: `
    <!-- reste -->
    <ul>
      <li *ngFor="let todo of todos$ | async; let i = index" >
        <!-- reste -->
        <button (click)="selectTodo(todo)">Modifier</button>
      </li>
    </ul>
  `
})
export class AllTodosComponent implements OnInit {
  // ... Other
  constructor(
	// ... Other
    private router: Router) {
    // ... Other
  }

  // ... Other
  selectTodo(todo) {
    console.log('select', todo);
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    this.router.navigate(['/todo-list/select-todo']);
  }
  // ... Other
}
```
Reste la fonctionnalité de Upadva être mis dans le **SelectTodoComponent** avec un formulaire assez semblable à celui de la création de todo.

 *modules/todo-list/components/select-todo/select-todo.component.ts*  
```javascript
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@StoreConfig';
import { selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListState, Todo } from '@Models/todo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-todo',
  styleUrls: ['./select-todo.component.scss'],
  template: `
      <h1>Mettre à jour la todo</h1>
      <form *ngIf="selectTodo$ | async; else NoElement"
      [formGroup]="updateTodoForm"
      (ngSubmit)="updateTodo(updateTodoForm.value)">
          <label>Titre :</label>
          <input type="text" formControlName="title" placeholder="Title"/>
          <label>Est-elle terminé ? :</label>
          <input type="checkbox" formControlName="completed"/>
          <button>Mettre à jour</button>
    </form>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class SelectTodoComponent implements OnInit {

    public updateTodoForm: FormGroup;
    public selectTodo$: Observable<Todo>;
    public selectTodo: Todo;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
  this.selectTodo$ = store
  .pipe(
    select(selectTodoSelected$),
    tap(selectTodos => {
      this.selectTodo = selectTodos;
    })
  );

  this.selectTodo$.subscribe();

    this.updateTodoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }
  ngOnInit() {
    if (this.selectTodo) {
      this.updateTodoForm.patchValue({
        title: this.selectTodo.title,
        completed: this.selectTodo.completed
      });
    }
  }

  updateTodo(formValue) {
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.UpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }

}

```
### Fin de la branche step-5
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE2NTkzNDEyOCwtMjUwMDk0OTc5XX0=
-->