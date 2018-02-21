import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        CREATE_TODO = '[todoList] Create Todo',
        DELETE_TODO = '[todoList] Delete Todo',
        SELECT_TODO = '[todoList] Select Todo',
        UPDATE_TODO = '[todoList] Update Todo',
        LOAD_INIT_TODOS = '[todoList] Load Init Todos',
        SUCCESS_INIT_TODOS = '[todoList] Success Init Todos',
        ERROR_INIT_TODOS = '[todoList] Error Init Todos'
    }

    export class LoadInitTodos {
        readonly type = ActionTypes.LOAD_INIT_TODOS;
    }

    export class SuccessInitTodos {
        readonly type = ActionTypes.SUCCESS_INIT_TODOS;
        constructor(public payload: Todo[]) {}
    }

    export class ErrorInitTodos {
        readonly type = ActionTypes.ERROR_INIT_TODOS;
    }


    export class CreateTodo {
        readonly type = ActionTypes.CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SelectTodo {
        readonly type = ActionTypes.SELECT_TODO;
        constructor(public payload: Todo) {}
    }

    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }

    export type Actions = DeleteTodo
        | UpdateTodo
        | SelectTodo
        | CreateTodo
        | LoadInitTodos
        | SuccessInitTodos
        | ErrorInitTodos;
}
