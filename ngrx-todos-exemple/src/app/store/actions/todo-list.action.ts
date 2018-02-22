import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        // Create Todo
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // Patch Todo
        DELETE_TODO = '[todoList] Delete Todo',
        SELECT_TODO = '[todoList] Select Todo',
        UPDATE_TODO = '[todoList] Update Todo',
        // Get Todos
        LOAD_INIT_TODOS = '[todoList] Load Init Todos',
        SUCCESS_INIT_TODOS = '[todoList] Success Init Todos',
        ERROR_INIT_TODOS = '[todoList] Error Init Todos'
    }

    // GET TODOS

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

    // POST TODO
    export class LoadCreateTodo {
        readonly type = ActionTypes.LOAD_CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessCreateTodo {
        readonly type = ActionTypes.SUCCESS_CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class ErrorCreateTodo {
        readonly type = ActionTypes.ERROR_CREATE_TODO;
    }

    // SELECT TODO
    export class SelectTodo {
        readonly type = ActionTypes.SELECT_TODO;
        constructor(public payload: Todo) {}
    }

    // PATCH TODO

    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    // DELETE TODO

    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }

    export type Actions = LoadInitTodos
        | SuccessInitTodos
        | ErrorInitTodos
        | LoadCreateTodo
        | SuccessCreateTodo
        | ErrorCreateTodo
        | SelectTodo
        | UpdateTodo
        | DeleteTodo;

}
