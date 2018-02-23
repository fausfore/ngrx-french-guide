import { TodoListModule } from '@Actions/todo-list.action';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AppState, reducers } from '@StoreConfig';

import { arrayOfTodos, initialState, singleTodo, stateWithData } from '../mock-value';
import * as selectors from './todo-list.selector';

describe('Todo selectors', () => {
    let store: Store<AppState>;
    const todos = [];
    const entities = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers)
            ]
        });
        store = TestBed.get(Store);
        spyOn(store, 'dispatch').and.callThrough();
    });

    describe('selectTodoListState$', () => {
        it('it should return todos state', () => {
            let result;

            store
                .select(selectors.selectTodoListState$)
                .subscribe(value => {
                    result = value;
                });

            expect(result).toEqual(initialState);

            store.dispatch(new TodoListModule.SuccessInitTodos(arrayOfTodos));

            expect(result).toEqual(stateWithData);
        });
    });

    describe('selectTodoListEntitiesConverted$', () => {
        it('it should return todos entities converted', () => {
            let result;

            store
                .select(selectors.selectTodoListEntitiesConverted$)
                .subscribe(value => {
                    result = value;
                });

            expect(result).toEqual([]);

            store.dispatch(new TodoListModule.SuccessInitTodos(arrayOfTodos));

            expect(result).toEqual(arrayOfTodos);
        });
    });

    describe('selectTodoSelected$', () => {
        it('it should return selectedTodo', () => {
            let result;

            store
                .select(selectors.selectTodoSelected$)
                .subscribe(value => {
                    result = value;
                });

            expect(result).toEqual(undefined);

            store.dispatch(new TodoListModule.SelectTodo(singleTodo));

            expect(result).toEqual(singleTodo);
        });
    });

    describe('selectTodosLoaded$', () => {
        it('it should return loaded props of todos', () => {
            let result;

            store
                .select(selectors.selectTodosLoaded$)
                .subscribe(value => {
                    result = value;
                });

            expect(result).toEqual(false);

            store.dispatch(new TodoListModule.SuccessInitTodos(arrayOfTodos));

            expect(result).toEqual(true);
        });
    });

    describe('selectTodosErrors$', () => {
        it('it should return logs props of logs todos', () => {
            let result;

            store
                .select(selectors.selectTodosErrors$)
                .subscribe(value => {
                    result = value;
                });

            expect(result).toEqual(undefined);

            store.dispatch(new TodoListModule.SuccessCreateTodo(singleTodo));

            expect(result).toEqual(
                { type: 'SUCCESS', message: 'La todo à été crée avec succès' }
            );
        });
    });


});
