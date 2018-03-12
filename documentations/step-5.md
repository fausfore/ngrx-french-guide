# Select & Update Todo

### *[Début de la branche step-5]*

Rajouter une propriété dans notre **TodoListState** afin de conserver une *todo*, ce qui permettra la mise à jour de celle-ci. 
Cela implique de modifier l'interface, les actions et le *reducer*.

*models/todo.ts*
```typescript
export interface TodoListState {
	// [...]
	selectTodo: Todo
}
```
Ajouter les actions **SELECT** & **UPDATE** qui ont un paramètre de type *Todo*.

*store/actions/todo-list.action.ts*
```typescript
export namespace TodoListModule {
	export enum ActionTypes {
		// [...]
		SELECT_TODO = '[todoList] Select Todo',
		UPDATE_TODO = '[todoList] Update Todo'
	}
	// [...]
	export class SelectTodo {
		readonly type = ActionTypes.SELECT_TODO;
		constructor(payload: Todo){}
	}
	
	export class UpdateTodo {
		readonly type = ActionTypes.UPDATE_TODO;
		constructor(payload: Todo){}
	}
	// [...]
	export type Actions = InitTodos
	| SelectTodo
	| DeleteTodo;
}
```
**SelectTodo** va récupérer le contenu du *payload*, et **UpdateTodo** va changer la *todo* qui match avec l'*id* du *payload* :

*/store/reducers/todo-list.reducer.ts*
```typescript
import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list';

const initialState: TodoListState = {
	// [...]
	selectTodo: undefined
};

export function todosReducer(
// [...]

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
	
		
// [...]      
```
Une fonction sera rattachée à l'événement au clique d'une* todo*.
Celle-ci redirigera l'utilisateur vers la page **/select-todo** tout en modifiant le state **selectTodo** :

*all-todos.ts*
```typescript
// [...]
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
  // [...]
  constructor(
	// [...]
    private router: Router) {
    // [...]
  }

  // [...]
  selectTodo(todo) {
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    this.router.navigate(['/todo-list/select-todo']);
  }
  // [...]
}
```
Reste la fonctionnalité de **UpdateTodo** qui sera dans le **SelectTodoComponent** :

 *modules/todo-list/components/select-todo/select-todo.component.ts*  
```typescript
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
Vous pouvez maintenant sélectionner et mettre à jour une *todo*.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-6.md)

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1MDQ2NTQ1NzYsLTI1MDA5NDk3OV19
-->