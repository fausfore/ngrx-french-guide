import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list-data';

const initialState: TodoListState = {
    data: [],
    loading: false,
    loaded: false
};

export function todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

  switch (action.type) {

    case TodoListModule.ActionTypes.INIT_TODOS:
        return {
            ...state,
            data: [
                ...todosMock
            ]
        };

    case TodoListModule.ActionTypes.CREATE_TODO:
        return {
            ...state,
            data: [
                ...state.data,
                action.payload
            ]
        };

    case TodoListModule.ActionTypes.DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };

    default:
        return state;
    }
}
