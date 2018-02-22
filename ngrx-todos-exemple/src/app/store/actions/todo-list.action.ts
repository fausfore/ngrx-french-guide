import { Todo } from '../../models/todo';
import { HttpErrorResponse } from '@angular/common/http';
export namespace TodoListModule {

    export enum ActionTypes {
        // Create Todo
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        // Patch Todo
        LOAD_UPDATE_TODO = '[todoList] Load Update Todo',
        SUCCESS_UPDATE_TODO = '[todoList] Success Update Todo',
        // Select Todo
        SELECT_TODO = '[todoList] Select Todo',
        // Delete Todo
        LOAD_DELETE_TODO = '[todoList] Load Delete Todo',
        SUCCESS_DELETE_TODO = '[todoList] Success Delete Todo',
        // Get Todos
        LOAD_INIT_TODOS = '[todoList] Load Init Todos',
        SUCCESS_INIT_TODOS = '[todoList] Success Init Todos',
        // Error request Todos
        ERROR_LOAD_ACTION = '[todoList] Error Load Action'
    }

    // GET TODOS

    export class LoadInitTodos {
        readonly type = ActionTypes.LOAD_INIT_TODOS;
    }

    export class SuccessInitTodos {
        readonly type = ActionTypes.SUCCESS_INIT_TODOS;
        constructor(public payload: Todo[]) {}
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

    // SELECT TODO
    export class SelectTodo {
        readonly type = ActionTypes.SELECT_TODO;
        constructor(public payload: Todo) {}
    }


    export class LoadUpdateTodo {
        readonly type = ActionTypes.LOAD_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessUpdateTodo {
        readonly type = ActionTypes.SUCCESS_UPDATE_TODO;
        constructor(public payload: Todo) {}
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

    // ERROR ACTIONS

    export class ErrorLoadAction {
        readonly type = ActionTypes.ERROR_LOAD_ACTION;
        constructor(public payload: HttpErrorResponse) {}
    }

    export type Actions = LoadInitTodos
        | SuccessInitTodos
        | LoadCreateTodo
        | SuccessCreateTodo
        | SelectTodo
        | LoadUpdateTodo
        | SuccessUpdateTodo
        | LoadDeleteTodo
        | ErrorLoadAction
        | SuccessDeleteTodo;

}
