import { Route, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { TodoListComponent } from './todo-list.component';
import { AllTodosComponent } from './components/all-todos/all-todos.component';
import { SelectTodoComponent } from './components/select-todo/select-todo.component';


const routes: Route[] = [
    {
        path: '',
        component: TodoListComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'all-todos'
            },
            {
                path: 'all-todos',
                component: AllTodosComponent
            },
            {
                path: 'select-todo',
                component: SelectTodoComponent
            },
            {
                path: '**',
                redirectTo: 'all-todos'
            }
        ]
    }
];

export const todoListRouting: ModuleWithProviders = RouterModule.forChild(routes);
