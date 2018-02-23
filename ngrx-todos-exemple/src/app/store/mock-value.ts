import { Todo } from '@Models/todo';
import * as fromReducer from '@Reducers/todo-list.reducer';

export const { initialState } = fromReducer;

export const arrayOfTodos: Todo[] = [
    { id: 1, userId: 2, title: 'for testing 1', completed: true },
    { id: 2, userId: 5, title: 'for testing 2', completed: false },
    { id: 3, userId: 4, title: 'for testing 3', completed: false },
    { id: 4, userId: 9, title: 'for testing 4', completed: true }
];

export const stateWithData = {
    ...initialState,
    ids: [1, 2, 3, 4],
    loaded: true,
    entities: {
        1 : arrayOfTodos[0],
        2 : arrayOfTodos[1],
        3 : arrayOfTodos[2],
        4 : arrayOfTodos[3],
    }
};


export const singleTodo: Todo = { id: 2, userId: 5, title: 'for testing 2', completed: false };