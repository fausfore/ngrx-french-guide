## Testings Advanced

### Mocks
Pour nos tests on aura besoin de valeur pour traiter les différents cas 

*store/mock-value.ts*
```javascript
import { Todo } from '@Models/todo';
import * as fromReducer from '@Reducers/todo-list.reducer';

export const { initialState } = fromReducer;

export const arrayOfTodos: Todo[] = [
    { id: 1, userId: 2, title: 'for testing 1', completed: true },
    { id: 2, userId: 5, title: 'for testing 2', completed: false },
    { id: 3, userId: 4, title: 'for testing 3', completed: false },
    { id: 4, userId: 9, title: 'for testing 4', completed: true }
];

export const stateWithData = {
    ...initialState,
    ids: [1, 2, 3, 4],
    loaded: true,
    entities: {
        1 : arrayOfTodos[0],
        2 : arrayOfTodos[1],
        3 : arrayOfTodos[2],
        4 : arrayOfTodos[3],
    }
};


export const singleTodo: Todo = { id: 2, userId: 5, title: 'for testing 2', completed: false };
```
### Actions

Tester nos actions reste relativement simple, on créer un instance de l'action et on vérifie le type ainsi que le payload si besoin.

```javascript
const action = new TodoListModule.ErrorLoadAction(message);
// Attention dans le expect 
expect({...action}). // GOOD
expect(action). // BAD

```
*todo-list.actions.spec.ts*

```javascript
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
```
### Reducers

Pour nos tests de reducer très simple également:

*todo-list.reducer.spec.ts*
```javascript
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
```
### Selectors

Pour tester les selectors cela demande un peu plus de complexité comme on récupère un state depuis un store il faut déjà créer une instance de Store accessible depuis le test dans le **beforeEach** ensuite cela nous permet de récupérer le default state du selector mais en plus on peut **dispatch une action** dans notre test afin de tester le selector après une action x.

*todo-list.selector.spec.ts*
```javascript
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

```
### Effects
Tester les effects augmente la complexité car elle utilise **[jasmine-marbles](https://github.com/synapse-wireless-labs/jasmine-marbles)** pour tester les observables, elle apporte une solution viable pour tester dans le temps et cela reste assez lisible et compréhensible.

*todo-list.effect.spec.ts*
```javascript
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { TodoListService } from '../../services/todo-list.service';
import * as fromActions from '../actions/todo-list.action';
import * as fromEffects from '../effects/todo-list.effect';
import { arrayOfTodos, singleTodo } from '../mock-value';

export class TestActions extends Actions {
    constructor () {
        super(empty());
    }
    set stream(source: Observable<any>) {
        this.source = source;
    }
}

export function getActions() {
    return new TestActions();
}


describe('Testing Effects', () => {
    let actions$: TestActions;
    let service: TodoListService;
    let effects: fromEffects.TodoListEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                TodoListService,
                fromEffects.TodoListEffects,
                { provide: Actions, useFactory: getActions }
            ]
        });
        actions$ = TestBed.get(Actions);
        service = TestBed.get(TodoListService);
        effects = TestBed.get(fromEffects.TodoListEffects);

        spyOn(service, 'getTodos').and.returnValue(of(arrayOfTodos));
        spyOn(service, 'createTodo').and.returnValue(of(singleTodo));
        spyOn(service, 'deleteTodo').and.returnValue(of(singleTodo.id));
        spyOn(service, 'patchTodo').and.returnValue(of(singleTodo));
    });

    describe('LoadTodos$', () => {
        it('should return a collection of todos', () => {
            const action = new fromActions.TodoListModule.LoadInitTodos();
            const completion = new fromActions.TodoListModule.SuccessInitTodos(arrayOfTodos);

            actions$.stream = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });

            expect(effects.LoadTodos$).toBeObservable(expected);

        });
    });

    describe('LoadCreateTodo$', () => {
        it('should return a todo item created', () => {
            const action = new fromActions.TodoListModule.LoadCreateTodo(singleTodo);
            const completion = new fromActions.TodoListModule.SuccessCreateTodo(singleTodo);

            actions$.stream = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });

            expect(effects.LoadCreateTodo$).toBeObservable(expected);

        });
    });

    describe('LoadDeleteTodo$', () => {
        it('should return a id of a todo suppressed', () => {
            const action = new fromActions.TodoListModule.LoadDeleteTodo(singleTodo.id);
            const completion = new fromActions.TodoListModule.SuccessDeleteTodo(singleTodo.id);

            actions$.stream = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });

            expect(effects.LoadDeleteTodo$).toBeObservable(expected);

        });
    });

    describe('LoadUpdateTodo$', () => {
        it('should return a todo patched', () => {
            const action = new fromActions.TodoListModule.LoadUpdateTodo(singleTodo);
            const completion = new fromActions.TodoListModule.SuccessUpdateTodo(singleTodo);

            actions$.stream = hot('-a', { a: action });
            const expected = cold('-b', { b: completion });

            expect(effects.LoadUpdateTodo$).toBeObservable(expected);

        });
    });

});
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTk3ODUwODg4NV19
-->