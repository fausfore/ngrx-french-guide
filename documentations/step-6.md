
# API

### *[Début de la branche step-6]*

On a maintenant toutes nos fonctionnalités : **Create, Select, Update, Delete**.
Cela reste du local ou du offline.
Il est temps de mettre en place un serveur et d'y inclure des requêtes **http**.

Pour maximiser le temps, on va créer une *API* avec le module npm **[JsonPlaceholder](https://jsonplaceholder.typicode.com/)** .

```bash
npm install -g json-serve
```
Dans notre projet, inclure un nouveau dossier **/server** au même niveau que **/app** et y ajouter un fichier *json* qui sera notre base de données :

```
src
|
└───app
|
└───server
|
└───db.json
```

  
*db.json*

```json

{
"todos": []
}

```

Entrer dans le terminal :

```bash
json-server path-of-json
```

Allez sur **localhost:3000/todos** et vous avez une API prête à l'emploi.

## Get Todos

Générer un service depuis le terminal :

```bash
ng g service services/todo-list
```

Déclarer dans le **AppModule** ainsi que le dernier module **HttpClient** de Angular :

*app.module.ts*

```javascript
// [...]
import { HttpClientModule } from  '@angular/common/http';
import { TodoListService } from  './services/todo-list.service';

@NgModule({
imports: [
// [...]

HttpClientModule

],

providers: [TodoListService]

})

export  class  TodoListModule { }

```

*services/todo-list.service*

```javascript
import { HttpClient } from  '@angular/common/http';
import { Observable } from  'rxjs/Observable';
import { Todo } from  '@Models/todo';
import { environment } from  '@Env';
  
@Injectable()
export  class  TodoListService {
	constructor(private  http:HttpClient) {}
	getTodos(): Observable<Todo[]> {
		return  this.http.get<Todo[]>(`${environment.apiUrl}/todos`);
	}

}

```
Plus simplement pour les *imports* :

*tsconfig.json*

```json
{
	"compilerOptions": {
	"baseUrl": "./src",
	"paths": {
		// [...]
		"@Services/*": ["app/services/*"],
		"@Env": ["environments/environment.ts"],
		}
	}
}

```

  

Dans ce fichier, placer les paramètres d'*API* comme l'*url* :

*environment.ts*

```json
export const environment = {
	production: false,
	apiUrl: 'http://localhost:3000'
};
```

Ajouter le service dans le *component*.
Et au *resolve* de la requête, passer **InitTodos** :

  

*modules/todo-list/components/all-todos/all-todo.component.ts*

```javascript
// [...]
import { TodoListService } from  '@Services/todo-list';

export  class  AllTodosComponent {
	// [...]
	constructor(
	// [...]
		private  todoListService: TodoListService
	) { // [...] }

	ngOnInit(){
	this.todoListService.getTodos()
		.subscribe((todos) => {
			this.store.dispatch(new  TodoListModule.InitTodos(todos));
		});
	}
	
// [...]

```

Changer l'action de **InitTodos** en lui ajoutant un payload :

*store/actions/todo-list.action.ts*

```javascript
export  namespace  TodoListModule {
	// [...]
	export  class  InitTodos {
		readonly  type = ActionTypes.INIT_TODO;
		constructor(public  payload: Todo[]){ }
	}
	// [...]
}

```

Le reducer doit retourner le *payload* à la place du *mock* que l'on peut totalement supprimer ~~/mocks~~

  

*store/reducers/todo-list.reducer.ts*

```javascript
// [...]

export  function  todosReducer(
	// [...]

	case TodoListModule.ActionTypes.INIT_TODOS :
		return {
			...state,
			data: [
			...action.payload
			]
		};

	// [...]

```

## Introduction des Effects

Les todos sont bien chargées mais avec NGRX il est possible d'aller plus loin en gérant également la partie **asynchrone** .

**Effects** est un second module de NGRX.
Il vous fournit des **listenners d'actions** qui peuvent effectuer des fonctions et retourner une **nouvelle action**.

<p  align="center">
<img  src="https://cdn-images-1.medium.com/max/1600/1*vSadxKWVoAirhVCa8fxiNw.png">
</p>

Avec un **Effect**, il n'y aura pas une action **InitTodos**, mais trois :

 - **LoadInitTodos** :  chargera les données de l'API ;
-  **SuccessInitTodos** : réponse serveur positive ;
-  **ErrorInitTodos** : réponse serveur négative.

  

>LoadInitTodos => SuccessInitTodos || ErrorInitTodos

  

Installation :

```bash
npm i @NGRX/effects --save ou yarn add @NGRX/effects --dev
```

Créer un nouveau fichier *effect/* :

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

Alias :

*tsconfig.json*

```json

{
	"compilerOptions": {
	"baseUrl": "./src",
	"paths": {
		// [...]
		"@Effects/*": ["app/store/effects/*"],
		}
	}
}

```

Ajouter les trois actions pour l'*effect* : **LOAD_INIT_TODOS, SUCCESS_INIT_TODOS, ERROR_INIT_TODOS**.

  

> Retirer l'action **InitTodos**

  

*store/actions/todo-list.action.ts*

```javascript
export  namespace  TodoListModule {
export  enum  ActionTypes {
	// [...]
	LOAD_INIT_TODOS = '[todoList] Load Init Todos',
	SUCCESS_INIT_TODOS = '[todoList] Success Init Todos',
	ERROR_INIT_TODOS = '[todoList] Error Init Todos',
	// a supprimer INIT_TODOS = '[todoList] Init Todos',
}
// [...]
/* A supprimer
export class InitTodos {
	readonly type = ActionTypes.INIT_TODO;
	constructor(public payload: Todo[]){ }
}
*/

export  class  LoadInitTodos {
	readonly  type = ActionTypes.LOAD_INIT_TODOS;
}

export  class  SuccessInitTodos {
	readonly  type = ActionTypes.SUCCESS_INIT_TODOS;
	constructor(payload: todo[]){}
}

export  class  ErrorInitTodos {
	readonly  type = ActionTypes.ERROR_INIT_TODOS
}

// [...]

export  type  Actions = DeleteTodo
// | InitTodos
| LoadInitTodos
| SuccessInitTodos
| ErrorInitTodos;

}

```

Nous avons deux étapes lors d'un **LoadinitTodos**, on peut donc faire un switch sur les propriétés dans le reducer et commencer à jouer avec les booléens **loading** & **loaded** .

Ce détail permettra de changer votre *template* lors du chargement des todos en ajoutant un *loader* et en désactivant les boutons durant la requête de chargement.

*store/reducers/todo-list.reducer.ts*

```javascript
// [...]
export  function  todosReducer(
// [...]
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

/* A supprimer
case TodoListModule.ActionTypes.INIT_TODOS :
	return {
		...state,
		data: [
		...action.payload
		]
	};
*/

// [...]

```

Pour écrire notre premier **Effect** qui est un **Observable**, on peut utiliser tout ce que peut nous fournir *RXJS* pour faire du traitement, combiner des states etc... :

*store/effects/todo-list.effect.ts*

```javascript
import { Injectable } from  '@angular/core';
import { Actions, Effect, ofType } from  '@NGRX/effects';
import { Observable } from  'rxjs/Observable';
import { catchError, map, switchMap } from  'rxjs/operators';
import { TodoListModule } from  '@Actions/todo-list.action';
import { TodoListService } from  '../../services/todo-list';

@Injectable()
export  class  TodoListEffects {
	// Ecoute les actions passées dans le store
	@Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
	.pipe(
		// Si l'action est de type 'LOAD_INIT_TODOS', applique la suite sinon ne fait rien
		ofType(TodoListModule.ActionTypes.LOAD_INIT_TODOS),
		
		// l'action du switchMap est l'objet d'action qui est récupérer dans le ofType
		// action = { type: '[todoList] Load Init Todos' }
		switchMap(action  =>  this.todoListService.getTodos())
		// Dans le switchMap, on éxécute le service qui retournera la réponse dans le map suivant
		// todos = Todo[]
		// Il n'y a plus qu'à renvoyer une action SuccessInitTodos avec les todos en params
		map(todos  =>  new TodoListModule.SuccessInitTodos(todos))
		
		// Si le resolve n'a pas abouti, il passe dans la fonction catchError
		// Qui renvoie l'action ErrorInitTodos
		catchError(() =>  new TodoListModule.ErrorInitTodos())
	);

	constructor(
	private  todoListService: TodoListService,
	private  actions$: Actions
	) {}

}
```

Pour finaliser l'implémentation des *effects*, déclarer un tableau d'*effect* dans l'index du store :

```javascript
// [...]
import { TodoListEffects } from  '@Effects/todo-list.effect';
// [...]
export  const  appEffects = [TodoListEffects];
// [...]
```
Ajouter deux autres sélecteurs pour le **loading** et le **loaded** state :

  

*store/selectors/todo-list.selector.ts*

```javascript
// [...]

export  const  selectTodosLoading$ =
	createSelector(selectTodoListState$,(todos) =>  todos.loading);
export  const  selectTodosLoaded$ =
	createSelector(selectTodoListState$,(todos) =>  todos.loaded);
```

  

Importer le module **EffectsModule** dans le module principal en lui passant notre tableau d'*effect* :

*app.module.ts*

```javascript
// [...]

import { EffectsModule } from  '@NGRX/effects';
import { appEffects, getReducers, REDUCER_TOKEN } from  './store';

@NgModule({

// [...]
imports: [
	// [...]
	EffectsModule.forRoot(appEffects),
],
// [...]
export class AppModule { }
```


*modules/todo-list/components/all-todos/all-todo.component.ts*

```javascript

// [...]

import { TodoListService } from  '../services/todo-list';
import { selectTodoListState$, selectTodosLoading$, selectTodos$ } from  '@Selectors/todo-list.selector';

@Component({
template:  `
<!--
Ajoutez votre loader
-->
`
})

  

// \[...\]

export  class  AllTodosComponent {

public  todosLoading: Observable<boolean>;

// \[...\]

constructor(

// \[...\]

// a supprimer private todoListService: TodoListService

) {

// \[...\]

this.todosLoading = store.pipe(select(selectTodosLoading$));

}

ngOnInit(){

/*

\* A supprimer

this.todoListService.getTodos()

.subscribe((todos) => {

this.store.dispatch(new TodoListModule.InitTodos(todos));

});

*/

this.store.dispatch(new  TodoListModule.LoadInitTodos())

}

// \[...\]

```

  

On a plus besoin d'avoir le service dans le component, c'est maintenant l'effect qui, via le \*\*LoadInitTodos\*\*, va utiliser le service \*\*getTodos\*\* qui dispatchera notre liste de todos via l'action \*\*SuccessInitTodos\*\*.


<!--stackedit_data:
eyJoaXN0b3J5IjpbLTk5OTg3Mjc4XX0=
-->