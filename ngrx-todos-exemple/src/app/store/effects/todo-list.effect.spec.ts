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
