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
