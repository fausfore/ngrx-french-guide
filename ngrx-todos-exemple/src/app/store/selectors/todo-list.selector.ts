import { createSelector } from '@ngrx/store';
import { AppState } from '..';
export { selectTodosIds, selectTodosEntities, selectTodos, selectTotalTodos } from '@Reducers/todo-list.reducer';
import * as fromTodos from '@Reducers/todo-list.reducer';


export const selectTodoListState$ = (state: AppState) => state.todos;

/*
export const selectTodos$ =
    createSelector(selectTodoListState$, (todos) => todos.data);
*/

export const selectTodoListEntitiesConverted$ = createSelector(selectTodoListState$, fromTodos.selectTodos);

export const selectTodoSelected$ =
    createSelector(selectTodoListState$, (todos) => todos.selectedTodo);

export const selectTodosLoaded$ =
    createSelector(selectTodoListState$, (todos) => todos.loaded);

export const selectTodosErrors$ =
    createSelector(selectTodoListState$, (todos) => todos.logs);
