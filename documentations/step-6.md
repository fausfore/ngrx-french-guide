
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
	constructor(public  payload: Todo\[\]){ }

}

// [...]

}

```

Et le reducer doit retourner le payload à la place du mock qu'on peut d'ailleurs totalement supprimer ~~/mocks~~

  

*/store/reducers/todo-list.reducer.ts*

```javascript

// \[...\]

export  function  todosReducer(

// \[...\]

case TodoListModule.ActionTypes.INIT_TODOS :

return {

...state,

data: \[

...action.payload

\]

};

// \[...\]

```

## Introduction des Effects

On charge bien les todos mais avec NGRX il est possible d'aller plus loin en gérant également la partie \*\*asynchrone\*\* pour le moment impossible dans le reducer **(synchrone only)** .

  

\*\*Effects\*\* est un second module créé par la team de NGRX qui a pour but de gérer ce genre de cas. En quelques mots, les \*\*Effects\*\* sont des \*\*listenners d'actions\*\* qui peuvent effectuer des fonctions et retourner une \*\*nouvelle action\*\* (ou pas).

  

<p  align="center">

<img  src="https://cdn-images-1.medium.com/max/1600/1*vSadxKWVoAirhVCa8fxiNw.png">

</p>

<center>Les effects</center>

  

Avec un \*\*Effect\*\* on n'aura plus qu'une seule action \*\*InitTodos\*\* mais 3 actions qui sont \*\*LoadInitTodos\*\* qui chargera les données de l'api et renverra à son tour 2 cas différents possibles :

-  \*\*SuccessInitTodos\*\* : réponse serveur positive

-  \*\*ErrorInitTodos\*\* : réponse serveur négative.

  

>LoadInitTodos => SuccessInitTodos || ErrorInitTodos

  

Pour l'installation :

```bash

npm i @NGRX/effects --save ou yarn add @NGRX/effects --dev

```

Et créer un nouveau fichier effect :

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

un alias :

\*tsconfig.json\*

```json

{

"compilerOptions": {

"baseUrl": "./src",

"paths": {

// \[...\]

"@Effects/*": \["app/store/effects/*"\],

}

}

}

```

On va ajouter les 3 actions pour l'effect : \*\*LOAD\_INIT\_TODOS, SUCCESS\_INIT\_TODOS, ERROR\_INIT\_TODOS\*\*.

  

> Au passage on retire l'action \*\*InitTodos\*\*

  

\*store/actions/todo-list.action.ts\*

```javascript

export  namespace  TodoListModule {

export  enum  ActionTypes {

// \[...\]

LOAD\_INIT\_TODOS = '\[todoList\] Load Init Todos',

SUCCESS\_INIT\_TODOS = '\[todoList\] Success Init Todos',

ERROR\_INIT\_TODOS = '\[todoList\] Error Init Todos',

// a supprimer INIT_TODOS = '\[todoList\] Init Todos',

}

// \[...\]

/*

\*\* A supprimer

export class InitTodos {

readonly type = ActionTypes.INIT_TODO;

constructor(public payload: Todo\[\]){ }

}

*/

export  class  LoadInitTodos {

readonly  type = ActionTypes.LOAD\_INIT\_TODOS;

}

export  class  SuccessInitTodos {

readonly  type = ActionTypes.SUCCESS\_INIT\_TODOS;

constructor(payload: todo\[\]){}

}

export  class  ErrorInitTodos {

readonly  type = ActionTypes.ERROR\_INIT\_TODOS;

}

// \[...\]

export  type  Actions = DeleteTodo

// | InitTodos

| LoadInitTodos

| SuccessInitTodos

| ErrorInitTodos;

}

```

Du coup comme nous avons deux étapes lors d'un \*\*initTodos\*\*, on peut faire un switch sur les propriétés dans le reducer et commencer à jouer avec les booleans \*\*loading\*\* & \*\*loaded\*\* .

Ce détail permettra de changer votre template lors du chargement des todos en ajoutant un loader et en desactivant les boutons durant la requête de chargement.

  

*/store/reducers/todo-list.reducer.ts*

```javascript

// \[...\]

export  function  todosReducer(

// \[...\]

  

case TodoListModule.ActionTypes.LOAD\_INIT\_TODOS:

// Passe le loading a true

return {

...state,

loading: true

};

case TodoListModule.ActionTypes.SUCCESS\_INIT\_TODOS:

// Bind state.data avec les todos du server

// Passe le loaded a true et le loading a false

return {

...state,

loading: false,

loaded: true,

data: action.payload

};

case TodoListModule.ActionTypes.ERROR\_INIT\_TODOS:

// Error rend le loading a false

return {

...state,

loading: false

};

/*

\*\* A supprimer

case TodoListModule.ActionTypes.INIT_TODOS :

return {

...state,

data: \[

...action.payload

\]

};

*/

// \[...\]

```

Il est temps d'écrire notre premier \*\*Effect\*\*. C'est un \*\*Observable\*\* donc on peut utiliser tous ce que peut nous fournir RXJS pour faire du traitement, combiner des states etc...

\*store/effects/todo-list.effect.ts\*

```javascript

import { Injectable } from  '@angular/core';

import { Actions, Effect, ofType } from  '@NGRX/effects';

import { Observable } from  'rxjs/Observable';

import { catchError, map, switchMap } from  'rxjs/operators';

import { TodoListModule } from  '@Actions/todo-list.action';

import { TodoListService } from  '../../services/todo-list';

  

@Injectable()

export  class  TodoListEffects {

// Listen les actions passées dans le Store

@Effect() LoadTodos$: Observable<TodoListModule.Actions\> = this.actions$

.pipe(

// Si l'action est de type 'LOAD\_INIT\_TODOS' applique la suite sinon ne fait rien

ofType(TodoListModule.ActionTypes.LOAD\_INIT\_TODOS),

// l'action du switchMap est l'objet d'action qui est récupérer dans le ofType

// action = { type: '\[todoList\] Load Init Todos' }

switchMap(action  =>  this.todoListService.getTodos())

// Dans le switchMap on éxécute le service et retournera le body dans le map suivant

// todos = Todo\[\]

// On a plus cas renvoyer une action SuccessInitTodos avec les todos en params

map(todos  =>  new  TodoListModule.SuccessInitTodos(todos))

// Si le resolve n'a pas abouti il passe dans cette fonction

// Qui renvoie l'action ErrorInitTodos

catchError(() =>  new  TodoListModule.ErrorInitTodos())

);

constructor(

private  todoListService: TodoListService,

private  actions$: Actions

) {}

}

```

Pour finaliser l'implémentation des effects on déclare un tableau de effect dans l'index du store :

```javascript

// ...te

import { TodoListEffects } from  '@Effects/todo-list.effect';

  

// \[...\]

export  const  appEffects = \[TodoListEffects\];

// \[...\]

```

On ajoute 2 autres sélecteurs pour le \*\*loading\*\* et le \*\*loaded\*\* state.

  

\*store/selectors/todo-list.selector.ts\*

```javascript

// \[...\]

export  const  selectTodosLoading$ =

createSelector(selectTodoListState$,(todos) =>  todos.loading);

export  const  selectTodosLoaded$ =

createSelector(selectTodoListState$,(todos) =>  todos.loaded);

```

  

On importe le module effect dans le module principal en lui passant notre tableau d'effects :

```javascript

// \[...\]

import { EffectsModule } from  '@NGRX/effects';

import { appEffects, getReducers, REDUCER_TOKEN } from  './store';

  

@NgModule({

// \[...\]

imports: \[

// \[...\]

EffectsModule.forRoot(appEffects),

\],

// \[...\]

export class AppModule { }

```

\*app.module.ts\*

  
  

\*modules/todo-list/components/all-todos/all-todo.component.ts\*

```javascript

// \[...\]

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
eyJoaXN0b3J5IjpbLTEwOTcyMTMxNzJdfQ==
-->