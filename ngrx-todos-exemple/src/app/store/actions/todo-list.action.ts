export namespace TodoListModule {

    export enum ActionTypes {
        INIT_TODOS = '[todoList] Init Todos'
    }

    export class InitTodos {
        readonly type = ActionTypes.INIT_TODOS;
    }

    export type Actions = InitTodos;
}
