import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { todosReducer, TodoListStateEntity } from './reducers/todo-list.reducer';
import { TodoListEffects } from '@Effects/todo-list.effect';
import { EffectsModule } from '@ngrx/effects';

export const reducers = {
    todos: todosReducer
};

export const appEffects = [TodoListEffects];

export interface AppState {
    todos: TodoListStateEntity;
}

export function getReducers() {
    return reducers;
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');

export const StoreModuleApply = {
    imports: [
        StoreModule.forRoot(REDUCER_TOKEN),
        EffectsModule.forRoot(appEffects),
    ],
    providers: [
        { provide: REDUCER_TOKEN, useFactory: getReducers }
    ]
};

