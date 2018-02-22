import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';

const initialState: TodoListState = {
    data: [],
    loading: false,
    loaded: false,
    selectedTodo: undefined,
    logs: undefined
};

export function todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

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
            ...state,
            loading: false,
            loaded: true,
            data: action.payload
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
            ...state,
            logs: { type: 'SUCCESS', message: 'La todo à été crée avec succès' },
            data: [
                ...state.data,
                action.payload
            ]
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
        return {
            ...state,
            loading: false,
            logs: { type: 'SUCCESS', message: 'La todo à été mise à jour avec succès' },
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };

    // DELETE TODO

    case TodoListModule.ActionTypes.LOAD_DELETE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload),
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
