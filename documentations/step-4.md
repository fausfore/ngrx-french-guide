

# Un peu de refacto !

### *[Début de la branche step-4]*

Changeons l'architecture du projet en mettant en place un *routing* :

```
app
│   app.component.ts
│   app.routing.ts  
│   app.module.ts  
└───store
└───modules
	└───todo-list
		│   todo-list.module.ts
		│   todo-list.component.ts
		|	todo-list.routing.ts
		└───components
			└───all-todos
			│	│   all-todos.component.ts
			└───select-todo
				│   select-todo.component.ts
```


Ci-dessous, une configuration de *routing* afin de charger notre module **TodoListModule** en *lazy-loading* avec le **loadChildren**.

 *app.routing.ts*  
```typescript
import { Route, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'todo-list'
    },
    {
        path: 'todo-list',
        loadChildren: './modules/todo-list/todo-list.module#TodoListModule'
    },
    {
        path: '**',
        redirectTo: 'todo-list'
    }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
```
Dans le **AppModule**, on peut déplacer les dépendances des formulaires vers **TodoListModule** :

*app.module.ts*
```typescript
// [...]
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { appRouting } from './app.routing';
// [...]
  imports: [
	  // ReactiveFormsModule,
	  // FormsModule,
	  appRouting 
	  // ...
  ],
// [...]
```

Migrer tout le contenu du **AppComponent** vers **AllTodosComponent**.
Il ne reste que la balise **router-outlet** :
*/app.component.ts*
```typescript
import { Component } from '@angular/core';

@Component({
	// [...]
  template: `<router-outlet></router-outlet>`
})

export class AppComponent{ }
```
Le fichier du *routing* pour le module **TodoList** :

 *modules/todo-list/todo-list.routing.ts*  
```typescript
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
            },
        ]
    }
];

export const todoListRouting: ModuleWithProviders = RouterModule.forChild(routes);
```
Et le fichier du module **TodoList** :

 *modules/todo-list/todo-list.module.ts*  
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { SelectTodoComponent } from './components/select-todo/select-todo.component';
import { AllTodosComponent } from './components/all-todos/all-todos.component';
import { todoListRouting } from './todo-list.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    todoListRouting,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [TodoListComponent, SelectTodoComponent, AllTodosComponent]
})

export class TodoListModule { }
```
Le **TodoListComponent** servira juste de lien entre nos deux autres *components* avec un autre **router-outlet** :

 *modules/todo-list/todo-list.component.ts*  
```typescript
import { Component } from '@angular/core';

@Component({
  template: `
	  <header>
		  <nav>
			  <a routerLink="all-todos">all todos</a>
			  <a routerLink="select-todo">select todo</a>
		  </nav>
	  </header>
	  <router-outlet></router-outlet>
  `
})
export class TodoListComponent {}
```

Le *component* qui contiendra la liste de *todos* :

 *modules/todo-list/components/all-todos/all-todo.component.ts*  
```typescript
import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from '../../../../store/actions/todo-list.action';
import { AppState } from '../../../../store';
import { Todo } from '../../../models/todo';
import { selectTodos$ } from '../../../../store/selectors/todo-list.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  template: `
    <h1>la todolist redux style !</h1>
    <form [formGroup]="todoForm" (ngSubmit)="createTodo(todoForm.value)">
      <label>Titre :</label>
      <input type="text" formControlName="title" placeholder="Title"/>
      <label>Est-elle terminé ? :</label>
      <input type="checkbox" formControlName="completed"/>
      <button>Créer</button>
    </form>
    <ul>
		<li *ngFor="let todo of todos$ | async">
			<label>{{ todo.title }}</label>
			<input type="checkbox" [ngModel]="todo.completed"/>
			<button (click)="deleteTodo(todo.id)">Supprimer</button>
		</li>
	</ul>
  `
})
export class AllTodosComponent implements OnInit {

  public todos$: Observable<Todo[]>;
  public todoForm: FormGroup;
  private todosLength: number;

  constructor(
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodos$),
        tap((todos) => {
          this.todosLength = todos.length;
        })
    );

    this.todoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }

  ngOnInit() {
    this.store.dispatch(new TodoListModule.InitTodos());
  }

  createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1,
      id: this.todosLength + 1
    };
    this.store.dispatch(new TodoListModule.CreateTodo(payloadtodo));
    this.todoForm.reset();
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }

}
```
## @Alias
On remarque que dans la nouvelle architecture, le dossier **store/** est très loin de nos composants ce qui crée beaucoup de  "../".
Pour y remédier, utilisez des **alias** via le **tsconfig.json** :

 *tsconfig.json*  
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
	  "@Models/*": ["app/models/*"],
      "@StoreConfig": ["app/store/index.ts"],
	      "@Actions/*": ["app/store/actions/*"],
	      "@Reducers/*": ["app/store/reducers/*"],
	      "@Selectors/*": ["app/store/selectors/*"],
    }
  }
}
```
Avec cette configuration, plus besoin de "../" :

  *modules/todo-list/components/all-todos/all-todo.component.ts*  
```typescript
import { AppState } from '@StoreConfig';
import { selectTodos$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
```
Si votre *IDE* indique une erreur, redémarrez-le.
Le point *refacto* est terminé.
Passons à la mise à jour des *todos*.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-5.md)

<!--stackedit_data:
eyJoaXN0b3J5IjpbMzcxNDI4MzQ2LC0xMDA5OTQwODU4XX0=
-->