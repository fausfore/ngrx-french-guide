import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list-data';

const initialState: TodoListState = {
    data: [],
    loading: false,
    loaded: false,
    selectedTodo: undefined
};

export function todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

  switch (action.type) {

    case TodoListModule.ActionTypes.INIT_TODOS:
        const todos = state.loaded ? state.data : todosMock;
        return {
            ...state,
            loaded: true,
            data: [
                ...todos,
            ]
        };

    case TodoListModule.ActionTypes.SELECT_TODO:
        return {
            ...state,
            selectedTodo: action.payload
        };

    case TodoListModule.ActionTypes.UPDATE_TODO:
        return {
            ...state,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
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
