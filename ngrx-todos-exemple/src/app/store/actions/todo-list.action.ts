import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        // Create Todo
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // Patch Todo
        // UPDATE_TODO = '[todoList] Update Todo',
        LOAD_UPDATE_TODO = '[todoList] Load Update Todo',
        SUCCESS_UPDATE_TODO = '[todoList] Success Update Todo',
        ERROR_UPDATE_TODO = '[todoList] Error Update Todo',
        // Select Todo
        SELECT_TODO = '[todoList] Select Todo',
        // Delete Todo
        LOAD_DELETE_TODO = '[todoList] Load Delete Todo',
        SUCCESS_DELETE_TODO = '[todoList] Success Delete Todo',
        ERROR_DELETE_TODO = '[todoList] Error Delete Todo',
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
    /*
    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }
    */

    export class LoadUpdateTodo {
        readonly type = ActionTypes.LOAD_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessUpdateTodo {
        readonly type = ActionTypes.SUCCESS_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class ErrorUpdateTodo {
        readonly type = ActionTypes.ERROR_UPDATE_TODO;
    }

    // DELETE TODO

    export class LoadDeleteTodo {
        readonly type = ActionTypes.LOAD_DELETE_TODO;
        constructor(public payload: number) {}
    }

    export class SuccessDeleteTodo {
        readonly type = ActionTypes.SUCCESS_DELETE_TODO;
        constructor(public payload: number) {}
    }
    export class ErrorDeleteTodo {
        readonly type = ActionTypes.ERROR_DELETE_TODO;
    }

    export type Actions = LoadInitTodos
        | SuccessInitTodos
        | ErrorInitTodos
        | LoadCreateTodo
        | SuccessCreateTodo
        | ErrorCreateTodo
        | SelectTodo
        // | UpdateTodo
        | LoadUpdateTodo
        | ErrorUpdateTodo
        | SuccessUpdateTodo
        | LoadDeleteTodo
        | ErrorDeleteTodo
        | SuccessDeleteTodo;

}
