# Créer une API

### *[Début de la branche step-6]*

Voilà on a maintenant toutes nos fonctionnalités : **Create, Select, Update, Delete**.
Mais cela reste du local ou du offline, il est temps de mettre en place un serveur et inclure des requêtes **http**.

Pour maximisé le temps on va créer un API avec le module npm **[JsonPlaceholder](https://jsonplaceholder.typicode.com/)** .
```bash
``
avec **npm install -g json-server**.
Le fichier va ajouter un nouveaux dossier **/server** au même niveau que **/app** et mettre un json :
```
src
|
└───app
|
└───server
	└───db.json
```
ensuite on ajoute :

*db.json*
```json
	{
		"todos": []
	}
```
Et pour finir sur un terminal, il suffit de rentrer 
```bash
json-server path-of-json
```
le port 3000 va s'ouvrir, allez sur **localhost:3000/todos** et hop une Api rest prête à l'emploi easy.

## Routes GET 
On va générer un service depuis la console : 
```bash
ng g service services/todo-list
```
Voilà maintenant plus qu'a le importé dans le AppModule et également vu que l'on va faire des requête Http de importé module le module http de Angular :

*app.module.ts*
```javascript
// ..other
import { HttpClientModule } from '@angular/common/http';
import { TodoListService } from './services/todo-list.service';

@NgModule({
  imports: [
	  // ..other
	  HttpClientModule 
  ],
  providers: [TodoListService]
})
export class TodoListModule { }
```
*services/todo-list.service*
```javascript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Todo } from '@Models/todo';
import { environment } from '@Env';

@Injectable()
export class TodoListService {
 
    constructor(private http:HttpClient) {}
 
    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(`${environment.apiUrl}/todos`);
    }
}
```
Un petit alias :
 *tsconfig.json*  
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
		// ... reste
		"@Services/*": ["app/services/*"],
		"@Env": ["environments/environment.ts"],
    }
  }
}
```

Dans ce fichier on place des paramètres d'api comme l'url :
 *environment.ts*  
```json
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

On ajoute le service dans le component et au **resolve** de la requête on lui passe le dispatch **InitTodos**

 *modules/todo-list/components/all-todos/all-todo.component.ts*  
```javascript
// ...other
import { TodoListService } from '@Services/todo-list';

// ...other
export class AllTodosComponent {
    // ...other
	constructor(
		// ...other
		private todoListService: TodoListService 
	) { // ...other }
	  
	  ngOnInit(){
	  this.todoListService.getTodos()
		  .subscribe((todos) => {
			  this.store.dispatch(new TodoListModule.InitTodos(todos));
		  });   
	  }
	  
// ...other
```
On change le **InitTodos** en lui ajoutant un payload

*store/actions/todo-list.action.ts*
```javascript
export namespace TodoListModule {
	// ...other
	export class InitTodos {
		readonly type = ActionTypes.INIT_TODO;
		constructor(public payload: Todo[]){ }
	}
	// ...other
}
```
Et le reducer retourne le payload à la place du mock que l'on peut supprimé maintenant ~~/mocks~~

*/store/reducers/todo-list.reducer.ts*
```javascript
// ...Other
export function todosReducer(
// ...Other
    case TodoListModule.ActionTypes.INIT_TODOS :
	    return {
			...state,
			data: [
				...action.payload
			]
		};
// ...Other
```
La logique fonctionne bien mais avec Ngrx il est possible d'aller beaucoup plus loin en gérant également la partie **asynchrone** pour le moment impossible dans le reducer **(synchrone only)** .
**Effects** est une second module créer par la team de ngrx qui a pour but de gérer ce genre de cas, en quelque mot les Effects sont des **listenners d'actions** qui peuvent effectués des fonctions et qui retourne une **nouvelle action** ( ou pas ). 

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*vSadxKWVoAirhVCa8fxiNw.png">
</p>
<center>Les effects</center>

Avec un effect au lieu d'avoir une seule action **InitTodos**, on aura une action **LoadInitTodos** qui chargera les données de l'api et renvoie une action **SuccessInitTodos** dans le cas d'une réponse 200 du server et un **ErrorInitTodos** en cas d'erreur serveur.
<center>LoadInitTodos => SuccessInitTodos || ErrorInitTodos</center>

Pour installez tous ça go terminal :
```bash
npm i @ngrx/effects --save ou yarn add @ngrx/effects --dev 
```
Et créer un nouveaux fichier d'effect :
```
app
└───modules
└───store
	└───actions  
	└───reducers
	└───selectors
	└───effects
		└───todo-list.effect.ts

```
Un petit alias :
 *tsconfig.json*  
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
		// ... reste
		"@Effects/*": ["app/store/effects/*"],
    }
  }
}
```
On va ajouter les 3 actions pour le effect : **LOAD_INIT_TODOS, SUCCESS_INIT_TODOS, ERROR_INIT_TODOS**.
Au passage on retire l'action **InitTodos**

*store/actions/todo-list.action.ts*
```javascript
export namespace TodoListModule {
	export enum ActionTypes {
		// ... other
		LOAD_INIT_TODOS = '[todoList] Load Init Todos',
		SUCCESS_INIT_TODOS = '[todoList] Success Init Todos',
		ERROR_INIT_TODOS = '[todoList] Error Init Todos',
		// a supprimer INIT_TODOS = '[todoList] Init Todos',
	}
	// ... other
	/*
	** A supprimer
	export class InitTodos {
		readonly type = ActionTypes.INIT_TODO;
		constructor(public payload: Todo[]){ }
	}
	*/
	export class LoadInitTodos {
		readonly type = ActionTypes.LOAD_INIT_TODOS;
	}
	
	export class SuccessInitTodos {
		readonly type = ActionTypes.SUCCESS_INIT_TODOS;
		constructor(payload: todo[]){}
	}
	
	export class ErrorInitTodos {
		readonly type = ActionTypes.ERROR_INIT_TODOS;
	}
	// ... other
	
	export type Actions = DeleteTodo
	// | InitTodos
	| LoadInitTodos
	| SuccessInitTodos
	| ErrorInitTodos;
}
```
Maintenant dans le reducer, vu que cette fois on fait de l'asynchrone on va commencer a jouer avec les booleans **loaded** & **loading** cela permettra de changer l'UI si les données sont en cours de fetch.

*/store/reducers/todo-list.reducer.ts*
```javascript
// ... other
export function todosReducer(
// ... other

    case TodoListModule.ActionTypes.LOAD_INIT_TODOS:
    // Passe le loading a true
	    return {
			...state,
			loading: true
		};
		
	case TodoListModule.ActionTypes.SUCCESS_INIT_TODOS:
	// Bind state.data avec les todos du server
	// Passe le loaded a true et le loading a false
	    return {
			...state,
			loading: false,
			loaded: true,
			data: action.payload
		};
		
	case TodoListModule.ActionTypes.ERROR_INIT_TODOS:
	// Error rend le loading a false
	    return {
			...state,
			loading: false
		};
	/*		
	** A supprimer
	case TodoListModule.ActionTypes.INIT_TODOS :
	    return {
			...state,
			data: [
				...action.payload
			]
		};
	*/
// ... other      
```
Maintenant que l'on a toutes les actions nécéssaire on écrie l'effect.
 
*store/effects/todo-list.effect.ts*
```javascript
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListService } from '../../services/todo-list';

@Injectable()
export class TodoListEffects {
  // Listen les actions passées dans le Store
  @Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
	  .pipe(
		// Si l'action est de type 'LOAD_INIT_TODOS' applique la suite sinon ne fait rien
	    ofType(TodoListModule.ActionTypes.LOAD_INIT_TODOS),
	    // l'action du switchMap est l'objet d'action qui est récupérer dans le ofType
	    // action = { type: '[todoList] Load Init Todos' }
	    switchMap(action => this.todoListService.getTodos())
	    // Dans le switchMap on éxécute le service et retournera le body dans le map suivant
	    // todos = Todo[]
	    // On a plus cas renvoyer une action SuccessInitTodos avec les todos en params
	    map(todos => new TodoListModule.SuccessInitTodos(todos))
	    // Si le resolve n'a pas abouti il passe dans cette fonction
	    // Qui renvoie l'action ErrorInitTodos
	    catchError(() => new TodoListModule.ErrorInitTodos())
	  );
 
  constructor(
    private todoListService: TodoListService,
    private actions$: Actions
  ) {}
}
```
Maintenant on déclare un array de effects dans l'index du store :
```javascript
// ...other
import { TodoListEffects } from '@Effects/todo-list.effect';

// ..other
export const appEffects = [TodoListEffects];
// ..other
```
On ajoute 2 autre selectors pour le loading et le loaded state.

*store/selectors/todo-list.selector.ts*
```javascript
// ... reste	
export const selectTodosLoading$ =
	createSelector(selectTodoListState$,(todos) => todos.loading);
	
export const selectTodosLoaded$ =
	createSelector(selectTodoListState$,(todos) => todos.loaded);
```

Et importer le module d"effect dans le rootModule en lui passant notre array de effects :
```javascript
// ... other
import { EffectsModule } from '@ngrx/effects';
import { appEffects, getReducers, REDUCER_TOKEN } from './store';

@NgModule({
  // ... other
  imports: [
	// ... other
    EffectsModule.forRoot(appEffects),
  ],
  // ... other
export class AppModule { }
```
*app.module.ts*


 *modules/todo-list/components/all-todos/all-todo.component.ts*  
```javascript
// ...other
import { TodoListService } from '../services/todo-list';
import { selectTodoListState$, selectTodosLoading$, selectTodos$ } from '@Selectors/todo-list.selector'; 

@Component({
template: `
    <h1>la todolist redux style !</h1>
    <form [formGroup]="todoForm" (ngSubmit)="CreateTodo(todoForm.value)">
	    <label>Titre :</label>
	    <input type="text" formControlName="title" placeholder="Title"/>
	    <label>Est-elle terminé ? :</label>
	    <input type="checkbox" formControlName="completed"/>
	    <button>Créer</button>
    </form>
    <ul>
		<li *ngFor="let todo of todos$ | async">
			<label>{{ todo.title }}</label>
			<input type="checkbox" [value]="todo.completed"/>
			<button (click)="DeleteTodo(todo.id)">Supprimer</button>
		</li>
	</ul>
    `
})

// ...other
export class AllTodosComponent {
public todosLoading: Observable<boolean>;
    // ...other
	constructor(
		// ...other
		// a supprimer private todoListService: TodoListService 
	) {
	// ...other
	this.todosLoading = store.pipe(select(selectTodosLoading$));
	}
	  
	  ngOnInit(){
	  /*
	  * A supprimer
	  this.todoListService.getTodos()
		  .subscribe((todos) => {
			  this.store.dispatch(new TodoListModule.InitTodos(todos));
		  });
		  */
		  this.store.dispatch(new TodoListModule.LoadInitTodos())
	  }
// ...other
```
Voilà le côté service est déplacer vers le Effect qui via le **LoadInitTodos()** va utiliser le service **todoListService.getTodos()** qui dispatchera la nouvelle valeur de todos dans le Store.
On a rajouter en plus un template de chargement qui s'affichera entre le **LoadInitTodos()** et le **SuccessInitTodos()**

### Fin de la branche step-6
<!--stackedit_data:
eyJoaXN0b3J5IjpbNTM3MTgwODcyLDUzMjg5ODE1Ml19
-->