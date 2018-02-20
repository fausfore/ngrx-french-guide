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

    case TodoListModule.ActionTypes.INIT_TODOS :
    return {
        ...state,
        data: [
            ...todosMock
        ]
    };

    default:
        return state;
    }
}
