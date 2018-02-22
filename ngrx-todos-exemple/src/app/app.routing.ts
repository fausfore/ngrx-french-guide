import { Route, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { IsTodosLoadedGuard } from './guards/is-todos-loaded/is-todos-loaded.guard';

const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'todo-list'
    },
    {
        path: 'todo-list',
        loadChildren: './modules/todo-list/todo-list.module#TodoListModule',
        canActivate: [IsTodosLoadedGuard]
    },
    {
        path: '**',
        redirectTo: 'todo-list'
    }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
