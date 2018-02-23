import { Todo } from '@Models/todo';

import { TodoListModule } from './todo-list.action';

describe('Todos actions', () => {

    describe('Error actions', () => {
        describe('ErrorLoadAction', () => {
            it('should create an action', () => {
                const message = { message: 'for testing' };
                const action = new TodoListModule.ErrorLoadAction(message);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.ERROR_LOAD_ACTION,
                    payload: message
                });
            });
        });
    });

    describe('Init Todos Actions', () => {

        describe('LoadInitTodos', () => {
            it('should create an action', () => {
                const action = new TodoListModule.LoadInitTodos();
                // Avoid error message { ...action }
                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.LOAD_INIT_TODOS
                });
            });
        });

        describe('SuccessInitTodos', () => {
            it('should create an action', () => {
                const payload: Todo[] = [
                    { id: 1, userId: 1, title: 'for testing', completed: true }
                ];
                const action = new TodoListModule.SuccessInitTodos(payload);
                // Avoid error message { ...action }
                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.SUCCESS_INIT_TODOS,
                    payload: payload
                });
            });
        });

    });
    describe('Create Todos Actions', () => {

        describe('LoadCreateTodo', () => {
            it('should create an action', () => {

                const payload: Todo = { id: 1, userId: 1, title: 'for testing', completed: true };
                const action = new TodoListModule.LoadCreateTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.LOAD_CREATE_TODO,
                    payload: payload
                });
            });
        });

        describe('SuccessCreateTodo', () => {
            it('should create an action', () => {

                const payload: Todo = { id: 1, userId: 1, title: 'for testing', completed: true };
                const action = new TodoListModule.SuccessCreateTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.SUCCESS_CREATE_TODO,
                    payload: payload
                });
            });
        });

    });

    describe('Select Todo Action', () => {

        describe('SelectTodo', () => {
            it('should create an action', () => {

                const payload: Todo = { id: 1, userId: 1, title: 'for testing', completed: true };
                const action = new TodoListModule.SelectTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.SELECT_TODO,
                    payload: payload
                });
            });
        });

    });

    describe('Update Todo Actions', () => {

        describe('LoadUpdateTodo', () => {
            it('should create an action', () => {

                const payload: Todo = { id: 1, userId: 1, title: 'for testing', completed: true };
                const action = new TodoListModule.LoadUpdateTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.LOAD_UPDATE_TODO,
                    payload: payload
                });
            });
        });

        describe('SuccessUpdateTodo', () => {
            it('should create an action', () => {

                const payload: Todo = { id: 1, userId: 1, title: 'for testing', completed: true };
                const action = new TodoListModule.SuccessUpdateTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO,
                    payload: payload
                });
            });
        });

    });

    describe('Delete Todo Actions', () => {

        describe('LoadDeleteTodo', () => {
            it('should create an action', () => {

                const payload = 1;
                const action = new TodoListModule.LoadDeleteTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.LOAD_DELETE_TODO,
                    payload: payload
                });
            });
        });

        describe('SuccessUpdateTodo', () => {
            it('should create an action', () => {

                const payload = 1;
                const action = new TodoListModule.SuccessDeleteTodo(payload);

                expect({...action}).toEqual({
                    type: TodoListModule.ActionTypes.SUCCESS_DELETE_TODO,
                    payload: payload
                });
            });
        });

    });
});
