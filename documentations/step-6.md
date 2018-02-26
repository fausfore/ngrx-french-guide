# Crée# API

### *[Début de la branche step-6]*

Voilà on a maintenant toutes nos fonctionnalités : **Create, Select, Update, Delete**.
Mais cela reste du local ou du offline, il est temps de mettre en place un serveur et  a ouoi mmencer  inclure des requêtes **http**.

Pour maximisé le temps on va créer un API avecour e on va rene le module npm **[JsonPlaceholder](https://jsonplaceholder.typicode.com/)** .
```bash
anpm install -g json-serve
```
Dans notre projet on va inclure
e e va ue un nouveau dossier **/server** au même niveau que **/app**  et ajouter un fichier json qui sera notre base de donnéestr un json :
```
src
|
└───app
|
└───server
	└───db.json
```

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
le port 3000 va s'ouvrir, allez sur **localhost:3000/todos** et hop une API prête à l'emploi.

## e G Angular Get TodosRoutes GET 
On va générer un service depuis la console : 
```bash
ng g service services/todo-list
```
aienant il reste à le déclarerls  le é dans le **AppModule** ainsi qu ais que le module Http de Angular.

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
Ici on utilise le dernière version du module Http : **HttpClient**.
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
Un petit alias pour nous simplifié la vie:
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

Dans ce fichier on place les paramètres d'api comme l'url :
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
On change l'action de **InitTodos** en lui ajoutant un payload.

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
Et le reducer dois retourner le payload à la place du mock qu'on peut d'ailleurs totalement supprimé.supprimé ~~/mocks~~

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
## Introduction de Effects
La logique fonctionne bien, on charge bien les todosLa logique fonctionne bien mais avec Ngrx il est possible d'aller plus loin en gérant également la partie **asynchrone** pour le moment impossible dans le reducer **(synchrone only)** .

**Effects** est un second module créer par la team de ngrx qui a pour but de gérer ce genre de cas, en quelque mot les **Effects** sont des **listenners d'actions** qui peuvent effectués des fonctions et retourne une **nouvelle action** ( ou pas ). 

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*vSadxKWVoAirhVCa8fxiNw.png">
</p>
<center>Les effects</center>

Avec un effect au lieu d'avoir une seule action **InitTodos**, on aura une action **LoadInitTodos** qui chargera les données de l'api et dans le cas nerse  erveur, on renverrarenvoie une action **SuccessInitTodos** et dans le cas inverse on retourne une action **ErrorInitTodos**d'une réponse 200 du sere e n **ErrorInitTodos**.
<center>LoadInitTodos => SuccessInitTodos || ErrorInitTodos</center>

Pour installer tous ça go terminal :
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
	└───selectrs
	└───effects
		└───todo-list.effect.ts

```
le petit alias :
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
On va ajouter les 3 actions pour le effect : 
**LOAD_INIT_TODOS,
SUCCESS_INIT_TODOS,
ERROR_INIT_TODOS**.

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
Du fMainte qu'on a comme deux étapes lors d'un **initTodos**, on peut faire un switch sur les propriéténant dans le reduc a e deu te os n  switch sur les propriétéva commencer a jouer avec les booleans **loadinged** & **loaded** .
Ce petit détail permettra de changer votre template lors du chargement des todos, en ajoutaing** cela permettra de changer l s es doe ont uen loader, bloquer des inputs etc ..cours de fetch.

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
Il est temps d'écrire le premier **Effect**, vous pouvez le voir cette un observable donc on peut utiliser également tous ce que peut nous fournir RXJS pour faire du traitement, combiner des states etc ..tet ue lon a tuts les ctos naire n cie eec.
 
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
Pour finaliser l'implémentation des effects,Maintenant on déclare un tableau d'array de effects dans l'index du store :
```javascript
// ...te
import { TodoListEffects } from '@Effects/todo-list.effect';

// ..other
export const appEffects = [TodoListEffects];
// ..other
```
Vous pouvez créer deuxOn ajoute 2 autres séelecteuors pour le **loading** et le **loaded** state.

*store/selectors/todo-list.selector.ts*
```javascript
// ... reste	
export const selectTodosLoading$ =
	createSelector(selectTodoListState$,(todos) => todos.loading);
	
export const selectTodosLoaded$ =
	createSelector(selectTodoListState$,(todos) => todos.loaded);
```

Et importé le module d"effect dans le module principal en lui passant notre tableau d'aa deffects :
```javascript
// ... other
import { EffectsModule } from '@ngrx/effects';
import { appEffects, getReducers, REDUCER_TOKEN } from './store';

@NgModule({
  // ... other
  imports: [
	// ... te
    EffectsModule.forRoot(appEffects),
  ],
  // ... other
export class AppModule { }
```
*app.module.ts*


 *modules/todo-list/components/all-todos/all-todo.component.ts*  
```javascript
// ...autresother
import { TodoListService } from '../services/todo-list';
import { selectTodoListState$, selectTodosLoading$, selectTodos$ } from '@Selectors/todo-list.selector'; 

@Component({
template: `
    <!--
	    Ajoutez votre loader
    --!
	    ute otre lader
    ->
    `
})

// ...autreste
export class AllTodosComponent {
public todosLoading: Observable<boolean>;
    // ...autreste
	constructor(
		// ...autresother
		// a supprimer private todoListService: TodoListService 
	) {
	// ...autreste
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
// ...autres
```

On a plus besoin d'avoir le service dans le component, c'est maintenant l'ete
```
oi le service s lce es e ffect qui via le **LoadInitTodos** va utilisé le service **getTodos** qui dispatchera notre liste de todos via l'action **SuccessInitTodos** dans le store qui lui mettra à jour le noe le de todos a laction **SuccessInitTodos** n e l ra temate.

p-6
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTExNzU5ODAyOTMsMTgyODk3MzI5OF19
-->