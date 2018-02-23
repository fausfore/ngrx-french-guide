import { TodoListModule } from '@Actions/todo-list.action';

import { arrayOfTodos, initialState, singleTodo, stateWithData } from '../mock-value';
import * as FromReducer from './todo-list.reducer';

describe('Todos reducer', () => {

    // Default
    describe('undefined action', () => {
        it('should return the default state', () => {
            const action: any = {} ;
            const state = FromReducer.todosReducer(undefined, action);

            expect(state).toBe(initialState);
        });
    });

    // Init Todos
    describe('LoadInitTodos action', () => {
        it('should set loading to true', () => {

            const action: TodoListModule.Actions = new TodoListModule.LoadInitTodos();
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.loading).toEqual(true);
            expect(state.entities).toEqual({});
        });
    });

    describe('SuccessInitTodos action', () => {
        it('should map an array to entities', () => {
            const entities = {
                1 : arrayOfTodos[0],
                2 : arrayOfTodos[1],
                3 : arrayOfTodos[2],
                4 : arrayOfTodos[3],
            };

            const action: TodoListModule.Actions =
                new TodoListModule.SuccessInitTodos(arrayOfTodos);
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.loading).toEqual(false);
            expect(state.loaded).toEqual(true);
            expect(state.entities).toEqual(entities);
        });
    });

    // Create Todo
    describe('LoadCreateTodo action', () => {
        it('should set loading to true', () => {

            const action: TodoListModule.Actions = new TodoListModule.LoadCreateTodo(singleTodo);
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.loading).toEqual(true);
            expect(state.entities).toEqual({});
        });
    });

    describe('SuccessCreateTodo action', () => {
        it('should add an entitie', () => {

            const action: TodoListModule.Actions = new TodoListModule.SuccessCreateTodo(singleTodo);
            const state = FromReducer.todosReducer(initialState, {...action});

            const entities = {
                2 : arrayOfTodos[1]
            };

            expect(state.loading).toEqual(false);
            expect(state.entities).toEqual(entities);
        });
    });

    // Select Todo
    describe('SelectTodo action', () => {
        it('should set selectedTodo with action payload', () => {

            const action: TodoListModule.Actions = new TodoListModule.SelectTodo(singleTodo);
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.selectedTodo).toEqual(singleTodo);
        });
    });

    // Update Todo
    describe('LoadUpdateTodo action', () => {
        it('should set loading to true', () => {

            const action: TodoListModule.Actions = new TodoListModule.LoadUpdateTodo(singleTodo);
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.loading).toEqual(true);
        });
    });

    describe('SuccessUpdateTodo action', () => {
        it('should patch an entities object with the action payload', () => {

            const updateValue = { id: 4, userId: 9, title: 'nouvelle valeur', completed: true };

            const action: TodoListModule.Actions =
                new TodoListModule.SuccessUpdateTodo(updateValue);

            const entities = {
                1 : arrayOfTodos[0],
                2 : arrayOfTodos[1],
                3 : arrayOfTodos[2],
                4 : updateValue,
            };

            const state = FromReducer.todosReducer(stateWithData, {...action});
            expect(state.loading).toEqual(false);
            expect(state.entities).toEqual(entities);
        });
    });

    // Delete Todo
    describe('LoadUpdateTodo action', () => {
        it('should set loading to true', () => {
            const id = 2;
            const action: TodoListModule.Actions = new TodoListModule.LoadDeleteTodo(id);
            const state = FromReducer.todosReducer(initialState, {...action});

            expect(state.loading).toEqual(true);
        });
    });

    describe('SuccessCreateTodo action', () => {
        it('should remove one todo', () => {
            const id = 2;
            const action: TodoListModule.Actions =
                new TodoListModule.SuccessDeleteTodo(id);
            const state = FromReducer.todosReducer(stateWithData, {...action});

            const entities = {
                1 : arrayOfTodos[0],
                3 : arrayOfTodos[2],
                4 : arrayOfTodos[3]
            };

            expect(state.entities).toEqual(entities);
            expect(state.loading).toEqual(false);
        });
    });
});
