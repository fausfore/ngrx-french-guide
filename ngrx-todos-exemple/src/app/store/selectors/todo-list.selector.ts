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
