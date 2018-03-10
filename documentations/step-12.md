# @Ngrx/Entity

### *[Début de la branche step-12]*

Cette partie fait un focus sur l'optimisation de performance.

Dans le cas ou notre todo-list contienne des milliers de todo, vous verriez une baisse de performance car sur chaque action on réalise une itération sur notre tableau.

Et si notre todo-list ne soit plus un tableau de todo mais plutôt une **entité** de todo, lors d'une action on ne fera pas une itération dans un tableau, à la place on lui passera directement une clef.

```javascript
const ArrayTodos = [
	{ id: 1, title: 'blabla' },
	// [...]
];

const EntityTodos = {
	id : { id: 1, title: 'blabla'}
};

```
C'est là que vient [Ngrx/entity](https://github.com/ngrx/platform/blob/master/docs/entity/README.md), ce module permet facilement de prendre en entrée un tableau, de créer une entité avec un **adapter** puis de rendre un tableau lors du **selector**, de plus il nous fourni des méthodes pour traiter directement avec notre entité comme **AddOne()** ou **AddMany()** .

```bash
npm install @ngrx/entity --save OR yarn add @ngrx/entity --dev
```

```javascript
// [...]
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
  
	// [...]
	
    case TodoListModule.ActionTypes.SUCCESS_INIT_TODOS:
        return {
            ...TodoListAdapter.addMany(action.payload, state),
            // [...]
        };

   // [...]
   
 case TodoListModule.ActionTypes.SUCCESS_CREATE_TODOS:
        return {
            ...TodoListAdapter.addOne(action.payload, state),
           // [...]
        };

    case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        const { id, ...changes } = action.payload;
        return {
            ...TodoListAdapter.updateOne({id: id, changes: changes}, state),
            // [...]
            };
            
    case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...TodoListAdapter.removeOne(action.payload, state),
            // [...]
        };
        // [...]

}

    export const {
    // select the array of user ids
    selectIds: selectTodosIds,
    // select the dictionary of user entities
    selectEntities: selectTodosEntities,
    // select the array of users
    selectAll: selectTodos,
    selectTotal: selectTotalTodos
  } = TodoListAdapter.getSelectors();

```

*store/index.ts*
```javascript
import { TodoListStateEntity } from './reducers/todo-list.reducer';

// [...]

// Changement de l'interface
export interface AppState {
    todos: TodoListStateEntity;
}

//  [...]

```
*todo-list.selector.ts*
```javascript
// [...]
import * as fromTodos from '@Reducers/todoL-list.reducer';

export const selectTodoListState$ = (state: AppState) => state.todos;

/*.reducer';

// ... à supprimer
export const selectTodos$ =
    createSelector(selectTodoListState$, (todos) => todos.data);
*/

export const selectTodoListEntities$ = Converted$ createSelector(
    selectTodoListState$,
    (state) => state.entities
);

export const selectTodoListEntitiesConverted$ = createSelector(
    selectTodoListState$,Entities$,
    (entities) => Object.keys(entities).map(id => entities[parseInt(id, 10)])
 fromTodos.selectTodos);

export const selectTodoSelected$ =
    createSelector(selectTodoListEntitiesState$, (todos) => todos.selectedTodo);

export const selectTodosLoaded$ =
    createSelector(selectTodoListEntitiesState$, (todos) => todos.loaded);

export const selectTodosErrors$ =
    createSelector(selectTodoListEntitiesState$, (todos) => todos.logs);

```
Switch du selector dans le component: 

*all-todos.component.ts*
```javascript
// [...]

import { 
	selectTodoListEntitiesConverted$ 
} from '@Selectors/todo-list.selector';

// [...]

  constructor(
    // [...]
  ) {
    this.todos$ = store
      .pipe(select(selectTodoListEntitiesConverted$));


//  [...]

```
Voilà nos todos sont stockées en tant que entité dans notre state.

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1OTk4MzkyNzYsMTIwNjY4MTQ4NSwtMj
AxODcwOTc0NF19
-->