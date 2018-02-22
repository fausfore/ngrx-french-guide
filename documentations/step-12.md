

## NGRX - ENTITY

### Début de la branche step-12

Cette partie est consacré a de l'optimisation de performance, dans le cas ou notre todo-list contient des milliers de todos on aurez une baisse des performance car car sur chaque action on réalise une itération et si notre todo-list de sois plus un array de todo mais plutôt une **entité** de todo, lors d'un changement on aurai besoin que d'un **object[key]** pour mettre à jour la liste et c'est là que vient [Ngrx/entity](https://github.com/ngrx/platform/blob/master/docs/entity/README.md) ce module permet facilement de prendre en entré un array de créer une entité avec un **adapter** puis de rendre un array lors du **selector**, en plus il fourni des méthodes pour traiter directement avec notre entité comme **AddOne()** ou **AddMany()** .

```bash
npm install @ngrx/entity --save OR yarn add @ngrx/entity --dev
```

```javascript
import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState, Todo  } from '../../models/todo';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface TodoListStateEntity extends EntityState<Todo> {
    loading: boolean;
    loaded: boolean;
    selectedTodo: Todo;
    logs: {
        type: string;
        message: string;
    };
}

export const TodoListAdapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
    sortComparer: false
});

export const initialState: TodoListStateEntity = TodoListAdapter.getInitialState({
    loading: false,
    loaded: false,
    selectedTodo: undefined,
    logs: undefined
});
/*
const initialState: TodoListState = {
    data: [],
    loading: false,
    loaded: false,
    selectedTodo: undefined,
    logs: undefined
};
*/

export function todosReducer(
    state = initialState,
    action: TodoListModule.Actions
): TodoListStateEntity {

  switch (action.type) {

    // GET TODOS
    case TodoListModule.ActionTypes.LOAD_INIT_TODOS:
        // Passe le loading a true
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_INIT_TODOS:
        // Bind state.data avec les todos du server
        // Passe le loaded a true et le loading a false
        return {
            ...TodoListAdapter.addMany(action.payload, state),
            loading: false,
            loaded: true
        };

    // POST TODO
    case TodoListModule.ActionTypes.LOAD_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_CREATE_TODO:
        return {
            ...TodoListAdapter.addOne(action.payload, state),
            loading: false,
            logs: { type: 'SUCCESS', message: 'La todo à été crée avec succès' }
        };

    // SELECT TODO
    case TodoListModule.ActionTypes.SELECT_TODO:
        return {
            ...state,
            selectedTodo: action.payload
        };

    // PATCH TODO

    case TodoListModule.ActionTypes.LOAD_UPDATE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        const { id, ...changes } = action.payload;
        return {
            ...TodoListAdapter.updateOne({id: id, changes: changes}, state),
            loading: false,
            logs: { type: 'SUCCESS', message: 'La todo à été mise à jour avec succès' }
        };

    // DELETE TODO

    case TodoListModule.ActionTypes.LOAD_DELETE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...TodoListAdapter.removeOne(action.payload, state),
            logs: { type: 'SUCCESS', message: 'La todo à été suprimmé avec succès' }
        };

    case TodoListModule.ActionTypes.ERROR_LOAD_ACTION:
        return {
            ...state,
            loading: false,
            logs: { type: 'ERROR', message: action.payload.message }
        };

    default:
        return state;
    }
}

```
```javascript
import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { todosReducer, TodoListStateEntity } from './reducers/todo-list.reducer';
import { TodoListEffects } from '@Effects/todo-list.effect';

const reducers = {
    todos: todosReducer
};

export const appEffects = [TodoListEffects];

export interface AppState {
    todos: TodoListStateEntity;
}

export function getReducers() {
    return reducers;
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');

```

```javascript
import { createSelector } from '@ngrx/store';
import { AppState } from '..';

export const selectTodoListState$ = (state: AppState) => state.todos;

/*
export const selectTodos$ =
    createSelector(selectTodoListState$, (todos) => todos.data);
*/

export const selectTodoListEntities$ = createSelector(
    selectTodoListState$,
    (state) => state.entities
);

export const selectTodoListEntitiesConverted$ = createSelector(
    selectTodoListEntities$,
    (entities) => Object.keys(entities).map(id => entities[parseInt(id, 10)])
);

export const selectTodoSelected$ =
    createSelector(selectTodoListState$, (todos) => todos.selectedTodo);

export const selectTodosLoaded$ =
    createSelector(selectTodoListState$, (todos) => todos.loaded);

export const selectTodosErrors$ =
    createSelector(selectTodoListState$, (todos) => todos.logs);

```
```javascript
import { TodoListModule } from '@Actions/todo-list.action';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Todo } from '@Models/todo';
import { select, Store } from '@ngrx/store';
import { selectTodoListEntitiesConverted$ } from '@Selectors/todo-list.selector';
import { AppState } from '@StoreConfig';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-all-todos',
  styleUrls: ['./all-todos.component.scss'],
  template: `
    <h1>la todolist redux style !</h1>
    <form [formGroup]="todoForm" (ngSubmit)="createTodo(todoForm.value)" class="form">
      <div class="form-field">
        <label class="title">Titre :</label>
        <input type="text" formControlName="title" placeholder="Title"/>
      </div>
      <div class="form-field">
        <label class="title inline">Est-elle terminé ? :</label>
        <label class="checkbox-container">
          <input type="checkbox" formControlName="completed"/>
          <span class="checkmark"></span>
        </label>
      </div>
      <button class="btn primary">Ajouter une todo</button>
    </form>
    <ul>
      <li *ngFor="let todo of todos$ | async; let i = index" >
        <p>{{ i }} - {{ todo.title }}</p>
        <label class="isDone" [ngClass]="{ 'clear' : todo.completed  }">{{ todo.completed ? 'terminé' : 'En cours...' }}</label>
        <div class="button-area centerY">
          <button class="btn alert" (click)="deleteTodo(todo.id)">Supprimer</button>
          <button class="btn primary" (click)="selectTodo(todo)">Modifier</button>
        </div>
      </li>
    </ul>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class AllTodosComponent {

  public todos$: Observable<Todo[]>;
  public todoForm: FormGroup;
  private todosLength: number;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder,
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodoListEntitiesConverted$),
        tap((todos) => {
          console.log('selectTodos', todos);
          this.todosLength = todos.length;
        })
    );

    this.todoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }

  createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
    };
    this.store.dispatch(new TodoListModule.LoadCreateTodo(payload));
    this.todoForm.reset();
  }

  selectTodo(todo) {
    console.log('select', todo);
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    return this.router.navigate(['/todo-list/select-todo']);
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
  }

}

```

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE5ODk5MDM0MTZdfQ==
-->