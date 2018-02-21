# Angular + Redux = NGRX

### Sommaire

 1. **Présentation**
 2.  Redux, kesako ?!
 3. Pourquoi Redux alors ?!
 4. Flux vs Redux
 5. Le Store la base de tout
 6. Le root reducer
 7. Le schéma
 8. Les actions
 9. Action creator
 10. **De Redux à Ngrx**
 11. Installation [step-1]
 12. Architecture Folder
 13. Set up
 14. States Selectors [step-2]
 15. Ajouter une todo
 16. Supprimer une todo [step-3]
 17. Refacto Time ! [step-4]
 18. Update Todo [step-5]
 19. Routes GET [step-6]
 20. BONUS TIME !! [step-7]
 21. Routes POST [step-8]



### Introduction

Dans cette article, nous allons voir comment utiliser le pattern redux dans une application Angular via Ngrx.
Ce dernier proposant une conception du développement  d'application autour d'actions utilisateurs et serveurs. Le but étant de supprimer les différentes mutations de données des composants et services Angular pour les centraliser dans un objet global, qui serait mutable uniquement par des actions typées.

> Pour le développement sur Angular **Visual studio code** est fortement recommandé. 
> Vous devrez aussi installer Angular sur votre machine avec un **npm i -g @angular/cli**.

**Intéret de NGRX**

- Le 1er avantage est le modèle **unidirectionnelle** avec lequel nous travaillerons, ce qui n'est pas le cas du standard MVC qui de son coté est **bidirectionnelle**.
- Le 2eme avantage est **"l'historisation"** :  comme tout les changement transitent par le store, chaque update/modification est loggé. De ce fait nous pouvons revenir dans l'historique, trouvé quelle mutation a créé un bug:  c'est en quelque sorte une **state machine**.

Comme Angular peut être utilisé avec **typescript** , Ngrx profite également du typage qui va verrouiller nos actions et ainsi lever plus tôt les erreurs en cours de développement.




<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*xORdWwOFLR-6D4ghvUa6AA.png">
</p>
<center>Le Modèle MVC (ce que nous souhaitons éviter)</center>

## Redux, kesako ?!

C’est un pattern née de **Flux**, une architecture crée chez Facebook, il apporte un worflow de données unidirectionnelle distribué par un dispatcher qui recueille des actions données par le serveur ou par l’utilisateur et conserve la nouvelle instance d’une donnée dans un store ou des stores qui mettent à jour la vue.
<p align="center">
  <img src="https://julienrenaux.fr/talks-src/2016/redux-angular2/img/flux-simple-f8-diagram-with-client-action-1300w_stores_views.png">
</p>
<center>Le Worflow de Flux</center>

L'architecture de flux présente peut contenir plusieurs structures de données indépendantes appelé **Store**
Chaque action passe par le dispatcher qui la transmet au store ciblé par l'action.   

## Pourquoi Redux alors ?!
Redux est une version moins compliqué de Flux, il s'en distingue par le fait
- qu’il y ait qu’un store donc une seule source de donnée, 
- des états immuables / immutables
- et pas de dispatcher. 

Grâce à la programmation fonctionnelles, le dispatcher est complètement retiré du schéma qui rend plus simple le développement.  
<center>
	<img width="600" src="https://wecodetheweb.com/2015/09/29/functionally-managing-state-with-redux/redux-cycle.png"/>
</center>

## Flux vs Redux
| Flux| Redux|
|--|--|
| les Stores contiennent les états et leurs logiques de mutations|  le store et leurs logiques de mutation sont séparer|
|Plusieurs Stores|Un seule Store|
|Stores indépendants|Store unique avec reducers|
|Dispatcher|Pas de dispatcher|
|Etats mutables|Etats immuables|

## Le Store la base de tout
C'est quoi un store en au final, le store est juste une fonction qui contient l'état des reducers, un getter, un dispatcher et des subscribers.

Voilà un exemple de store *from scratch simplifié* :

***Ne pas reproduire***

```javascript
class Store {
	private subscribers: Function[];
	private reducers: { key: string: Function };
	private state: { key: string: any }

	constructor(reducers = {}, initalState = {}){
		this.subscribers = [];
		this.state = this.reduce(initalState,{});
	}

	get value(){
		// retourne les données du store
		return this.state
	}
	public select(key){
		return this.state[key]
	}

	subscribe(fn){
		this.subscribers = [...this.subscribers, fn];
		this.notify();
		return () => {
			this.subscribers = this.subscribers.filter(sub => sub !== fn)
		}
	}

	dispatch(){
		this.state = this.reduce(this.state, action);
		this.notify();
	}

	private notify(){
		this.subscribers.forEach(fn => fn(this.value))
	}
	private reduce(state, action){
		// le 1er param est le state global du store
		// le 2eme est l'object d'action passé dans la méthode dispatch

		const newState = {}; // objet vide

		/*
			Boucle sur toutes les clefs des reducers en leur passant l'action,
			si l'un des switch case d'un reducer match avec celui le type de l'action,
			il fera la mutation du switch.
			Popule newState avec les nouveaux states
		*/
		for(const prop in this.reducers){
			newState[prop] = this.reducers[prop](state[prop], action);
			/*
				exemple =>
				newState[counter] = this.reducers[counter](state[couter], {
					type: 'INCREMENT'
				});
			*/
		}
		// le retour va devenir la nouvelle référence des données du store
		return newState;
	}
}
```
Comment faire une instance du store :
```javascript
import * as Store from './store';
import * as RootReducer from './reducers';

new Store(RootReducer/*,{}*/);
// Le store prend en 1er param, un objet qui contiendra l'ensemble des reducers
// 2ème param, un objet qui est l'état du store,
// en général les reducers ont leurs propre valeur par default donc il est inutile de le rajouter.
```

## Le root reducer
Le root reducer est un simple objet qui a pour propriété des fonctions. Elle représente l'ensemble des mutations de l'application.

***Ne pas reproduire***
```javascript
import counterReducer from './counter-reducer';

const rootReducer = {
	counter: counterReducer,
	...etc  	
}
```
Chaque function reducer a pour argument son état et une action,
***Ne pas reproduire***
```javascript
// on part de 0
const initialState = { counter: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    // selon l'action …
    case "INCREMENT":
      // … on retourne un nouvel état incrémenté
      return state.counter + 1;

    case "DECREMENT":
      // … ou décrémenté
      return state.counter - 1;

    case "SET_NEW_VALUE":
      // … on change complétement de valeur
      return action.payload;

    default:
      // ou l'état actuel, si l'on n'y touche pas
      return state;
  }
};
```
Les reducers ne fonctionnent que avec des fonctions pures, elle ne doit ** jamais** modifié directement l'état mais renvoyé un nouvelle état a partir de celui-ci.
## Le schéma
Voilà, on voit bien que les reducers encapsules les différentes logiques de mutation et le store contient le résultat de chaque reducer comme deux objets miroir synchronisés à chaque action.
```javascript
const store = {
	counter: 0
};

const rootReducer = {
	counter: Function
};
```

## Les actions
Les actions sont des objets javascript, elle contienne au minimum une propriété **type** qui contient une string.

```javascript
const action = {
	type:'INCREMENT'
};
```
Cette propriété va permettre au reducer de savoir quelle mutation appliqué sur l'état actuel. Le nommage du type doit être explicite pour garder une bonne traçabilité lors d'un changement. Une meilleur pratique consiste à utilisé des constants pour les type d'action, par ailleurs avec les constants ont peu écrire des types plus lisible.

```javascript
const SET_NEW_VALUE = '[counter] Set new value';
```
Vu que c'est un objet on peut lui rajouter autant de propriété que l'on veut :

```javascript
import { SET_NEW_VALUE } from './constants';

const action = {
	type: SET_NEW_VALUE,
	payload: 6,
	...etc
};
```
## Action creator
Il existe une manière différente et préférable de réaliser une action, c'est d'utiliser une Class d'action, **Action creator**

```javascript
import { SET_NEW_VALUE } from './constants';

class SetNewValue {
	readonly type = SET_NEW_VALUE;
	constructor(public payload: number) {}
}
```
Et comment l'utilisé à la place de l'objet
```javascript
import * as CounterActions from './actions';

new CounterActions.SetNewValue(6)
// resultat => { type: '[counter] Set new value', payload: 6 }
```
L'action creator permet également de mieux utilisé le typage pour les valeurs optionnelles.
Maintenant on la structure de l'action, il faut voir comment injecter l'action dans le store, plus haut on a vu que le store dispose d'une méthode **dispatch()**, c'est elle qui va mettre à jour le store avec l'action passé en paramètre
```javascript
import * as CounterActions from './actions';
import { store } from './store'

store.dispatch(new CounterActions.SetNewValue(6))
// resultat => { counter : 6 }
```
# De Redux à Ngrx

### Début de la branche step-1 

Redux est un pattern déjà bien implémenter sur les principaux frameworks/librairies javascript du moment.
Pour React  => **react-redux**
Pour Vue  => **vuex**
Pour Angular  => **Ngrx**

Il est donc inutile de créer un store from scratch. Comme nous allons créer une application Angular, nous utiliserons **Ngrx**.
Cette librairie est donc une implémentation "reduxienne". Mais pas que... elle prend une bonne couche de **RxJS** comme Angular lui-même et utilise les **Observables** pour populer les states dans les composants Angular.

## Installation

Pour commencer on part sur un angular version 5 donc vous devez avoir votre Cli au dessus de la version **1.6.0**, elle doit comprendre la version **5.5.6** de RxJs pour utliser les **pipes** qui seront utilisé plus tard.
Donc on créer un nouveau projet angular
```shell
$ ng new ngrx-tutoriel-app --style=scss
```
puis dans le dossier rajouter **Ngrx en version 5.0 et plus**
```shell
$ npm install @ngrx/store ou yarn add @ngrx/store
```

## Architecture Folder
Pour le schéma des folders partez de **app/**
```
app
│   app.component.ts
│   app.component.scss
│	app.component.html
│   app.module.ts  
└───store
│   │   index.ts
│   └───actions
│   │   │   exemple.action.ts
│   │   │   ...
│   └───reducers
│  	│   │   exemple.reducer.ts
│   │   │   ...
└───modules
```

## Set up

Pour changer de l'exemple du counter, on va partir sur une **todolist**, eh oui encore ...
Avec l’implémentation de Redux on va penser en actions utilisateur et serveur et faire une synthèse de celle-ci :
Pour faire une todolist on a :

Une initalisation des todos -> **GET**
Création de todo -> **PUT**
Suppression de todo-> **DELETE**
Modification de todo -> **PATCH / POST**

Un bon vieux **CRUD** quoi.

On commence a écrire notre InitializeTodos et l'interface .

*models/todo.ts*
```javascript
export interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

export interface TodoListState {
	data: Todo[];
	loading: boolean;
	loaded: boolean;
}
```
On se base sur le model de **[JsonPlaceholder](https://jsonplaceholder.typicode.com/)**.
*mocks/todo-list.ts*
```javascript
export const todosMock = [{
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  },
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  },
  {
    "userId": 1,
    "id": 4,
    "title": "et porro tempora",
    "completed": true
  },
  {
    "userId": 1,
    "id": 5,
    "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
    "completed": false
  },
  {
    "userId": 1,
    "id": 6,
    "title": "qui ullam ratione quibusdam voluptatem quia omnis",
    "completed": false
  },
  {
    "userId": 1,
    "id": 7,
    "title": "illo expedita consequatur quia in",
    "completed": false
  }]
```
Un petit mock pour tester.

*store/actions/todo-list.action.ts*
```javascript
export namespace TodoListModule {

    export enum ActionTypes {
        INIT_TODOS = '[todoList] Init Todos'
    }

    export class InitTodos {
        readonly type = ActionTypes.INIT_TODOS;
    }

    export type Actions = InitTodos;
}
```
Question pratique je préfère encapsulé le tout dans un **namespace** pour simplifié les import, libre à vous de ne pas le faire.
Le dernier export Actions servira pour le typage du reducer uniquement.


*/store/reducers/todo-list.reducer.ts*
```javascript
import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list-data';

const initialState: TodoListState = {
    data: [],
    loading: false,
    loaded: false
};

export function todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

  switch (action.type) {

    case TodoListModule.ActionTypes.INIT_TODOS :
    return {
        ...state,
        data: [
            ...todosMock
        ]
    };

    default:
        return state;
    }
}
```
*exemple : /store/index.ts*
```javascript
import { ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { todosReducer } from './reducers/todo-list.reducer';
import { TodoListState } from '../models/todo';

const reducers = {
    todos: todosReducer
};

export interface AppState {
    todos: TodoListState;
}

export function getReducers() {
    return reducers;
}

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<AppState>>('Registered Reducers');
```

> Le mode Ahead of Time (AoT) Compilation de Angular exige que tous les symboles référencés dans les métadonnées du décorateur soient analysables statiquement. Pour cette raison, nous ne pouvons pas injecter dynamiquement l'état à l'exécution avec AoT sauf si nous fournissons notre **reducers** en tant que fonction. 

*/app.module.ts*
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule} from '@ngrx/store';
import { getReducers, REDUCER_TOKEN } from './store';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(REDUCER_TOKEN)
  ],
  providers: [
    {
      provide: REDUCER_TOKEN,
      useFactory: getReducers
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


>Maintenant pour créer notre **Store**, il suffit de prendre le **StoreModule** et de lui injecter nos reducers.

*exemple : /app.component.ts*
```javascript
import { Store, select } from '@ngrx/store';
import { OnInit, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from './store/actions/todo-list.action';
import { AppState } from './store';
import { Todo } from './models/todo';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <h1>la todolist redux style !</h1>
    <ul>
		<li *ngFor="let todo of (todos$ | async)?.data">
			<label>{{ todo.title }}</label>
			<input type="checkbox" [value]="todo.completed"/>
			<button>Supprimer</button>
		</li>
	</ul>
  `
})
export class AppComponent implements OnInit {

  todos$: Observable<Todo[]>;

  constructor(
    private store: Store<AppState>
  ) {
    this.todos$ = store.pipe(select('todos'));

    /* A éviter
	this.todo$.subscribe((todos) => {
		this.todos = todos;
	});

    Dans ce cas de figure on ne fait pas de mutation sur la liste
    de todos dans le composant et cela évite de faire
    un unsubscribe dans le OnDestroy
    ainsi qu'un *ngIf dans le <ul> dans le cas ou la donnée soit vide.
	*/

  }

  ngOnInit() {
    this.store.dispatch(new TodoListModule.InitTodos());
  }

}

```

### Fin de la branche step-1 


## States Selectors

### Début de la branche step-2

> Le **pipe async** souscrit à un Observable ou une Promise et renvoie la dernière valeur qu'il a émise. Lorsqu'une nouvelle valeur est émise, le canal asynchrone marque un composant afin de vérifier les modifications. Lorsque le composant est détruit, **le pipe async se désinscrit automatiquement pour éviter les fuites de mémoire potentielles**.

> Voilà nos todos s'affiche bien dans la vue mais faire ce serait mieux de renvoyer directement
> la liste plutôt que de faire **(todos$ | async)?.data** mais de faire directement **todos$ | async**, pour cela faut comprendre quelque chose au niveau du **select('todos')**, actuellement il renvoie le contenu entier du reducer todos avec le loaded et le loading et pour ne renvoyer que les todos au lieu de lui passer une string en paramètre on peut lui passer une fonction.

```html
<li *ngFor="let todo of todos$ | async">
```
```javascript
this.todos$ = store.pipe(select((state) => state.todos.data));
```
De cette manière on ne renvoie que ce que l'on souhaite s'afficher dans le composant cela ouvre la voie au concept des **states selectors**.

Comme son nom le précise on va pouvoir sélectionner une partie d'un state voir même pouvoir renvoyer une itération modifié du state grâce au traitement de RxJs sur les Observables car oui nos states sont des observables et bénéficie de l'énorme api RxJs pour faire du traitement sur nos données.
Pour voir un peu les différentes méthodes : http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html

On en voit un premier qui est la fonction **Pipe()** que sera très très très utilisé dans nos traitement:
elle permet de composé un chaînage de méthode rxjs de manière plus lisible.

*exemple de pipe*
```javascript
const { Observable } = require('rxjs/Rx')
const { filter, map, reduce } = require('rxjs/operators')
const { pipe } = require('rxjs/Rx')

const filterOutEvens = filter(x => x % 2)
const doubleBy = x => map(value => value * x);
const sum = reduce((acc, next) => acc + next, 0);
const source$ = Observable.range(0, 10)

source$
	.pipe(
	  filterOutEvens, 
	  doubleBy(2), 
	  sum
	 ).subscribe(console.log); // 50
	 
```
Du coup l’idée est transformé la source de l'observable avant même le subscribe de manière pur c'est à dire la source initiale n'a pas été altéré par ces changements.

*store/selectors/todo-list.selector.ts*
```javascript
import { createSelector } from '@ngrx/store';

export const selectTodoListState$ = (state: AppState) => state.todos;

export const selectTodos$ =
	createSelector(selectTodoListState$,(todos) => todos.data);
```
*/app.component.ts*
```javascript
import { selectTodos } from 'store/selectors/todo-list.selector';

// Other things ...

this.todos$ = store.pipe(select(selectTodos$));
```
Voilà maintenant le sélecteur pourrait être utilisé dans plein d'autre component.

## Ajouter une todo

On va créer un formulaire pour créer une todo grâce au formsbuilder d'Angular

*/app.component.ts*
```javascript
import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from './store/actions/todo-list.action';
import { AppState } from './store';
import { Todo } from './models/todo';
import { selectTodos$ } from './store/selectors/todo-list.selector';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
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
			<button>Supprimer</button>
		</li>
	</ul>
  `
})
export class AppComponent implements OnInit {

  todos$: Observable<Todo[]>;
  public todoForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
    this.todos$ = store.pipe(select(selectTodos$));

    this.todoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });

  }

  createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
      id: 8 // id au pif
    };
    this.store.dispatch(new TodoListModule.CreateTodo(payload));
    this.todoForm.reset();
  }

  ngOnInit() {
    this.store.dispatch(new TodoListModule.InitTodos());
  }

}
```
Ne pas oublier de charger les modules forms de Angular.

*/app.module.ts*
```javascript
// ... reste
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// ... reste
  imports: [
	  ReactiveFormsModule,
	  FormsModule,
	  // ...
  ],
// ... reste
```

Maintenant créons l'action côté Store et reducer :

*store/actions/todo-list.action.ts*
```javascript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        INIT_TODOS = '[todoList] Init Todos',
        CREATE_TODO = '[todoList] Create Todo',
    }

    export class InitTodos {
        readonly type = ActionTypes.INIT_TODOS;
    }

    export class CreateTodo {
        readonly type = ActionTypes.CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export type Actions = InitTodos | CreateTodo;
}
```

> Cette action transmet un **payload** qui sera la nouvelle todo.


*/store/reducers/todo-list.reducer.ts*
```javascript
	// ... reste
    case TodoListModule.ActionTypes.CREATE_TODO:
	    return {
			...state,
			data: [
				...state.data,
				action.payload
			]
		};
	// ...reste
```
Voilà notre action **createTodo** est terminé pour le moment il reste des chose a revoir comme la gestion des ids mais ce soucis se réglera seule quand on écrira le service Http.

### Fin de la branche step-2

## Supprimer une todo

### Début de la branche step-3

Même procédé que pour la création, cette fois on va passer l'id de la todo a supprimer dans le reducer avec un **filter()** le tour est jouer.

*store/actions/todo-list.action.ts*
```javascript
// ... Other
export namespace TodoListModule {

    export enum ActionTypes {
        // ... Other
        DELETE_TODO = '[todoList] Delete Todo',
    }

	// ... Other

    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }

    export type Actions = InitTodos
        | CreateTodo
        | DeleteTodo;
}
```

*/store/reducers/todo-list.reducer.ts*
```javascript
	// ... reste
    case TodoListModule.ActionTypes.DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };
	// ...reste
```

*/app.component.ts*
```javascript
// Other things ...
 template: `
    <!-- reste -->
	<li *ngFor="let todo of todos$ | async">
		<!-- reste -->
		<button (click)="deleteTodo(todo.id)">Supprimer</button>
	</li>
  `
    // Other things ...
  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }
}
```
Voilà comme cela devrait fonctionner mais il y a un soucis pour le moment a chaque fois que l'on rajoute une todo on lui donne un id 8 ce qui pose un problème, il faut un id unique. Pour le moment on a deux options calculer la longueur du tableau ou créer des id unique via un généreteur comme [uuid](https://www.npmjs.com/package/uuid) mais l'exemple la 1er option suffit.

*/app.component.ts*
```javascript
// Other things ...
import { tap } from 'rxjs/operators';
// Other things ...
private todoslength : number;
// Other things ...
this.todos$ = store
	.pipe(
		select(selectTodos$),
		tap((todos) => {
			this.todoslength = todos.length;
		})
	);
// Other things ...
CreateTodo(todo: Todo){
	const payload = {
		  ...todo,
		  userId: 1, // userId au pif
		  id: this.todoslength + 1
	};
```
Voilà l'id s’incrémentera au fur est mesure que la collection grandit pour cela on a poussé un peu plus le **pipe()**, cela donne un 1er apercu de la cascade de fonctions qui suis cette opérateur, en lui rajoutant un **tap()**.

>**tap** invoque une action pour chaque élément de la séquence observable.

Le truc intéressant aussi c'est que l'on a pu récupérer cette valeur **sans faire un subscribe sur l'observable selectTodos$** propre.
Voilà la suppression completed !

### Fin de la branche step-3

## Refacto Time !

### Début de la branche step-4

Avant de se lancer sur l'update de todo on va changer un peu l'architecture du projet et mettre en place un peu de routing.

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
Une config de router pour du lazy-loading avec le **loadChildren**.
 *app.routing.ts*  
```javascript
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
Dans le **AppModule** on peut retirer les dépendances pour les formulaires.

*app.module.ts*
```javascript
// ... reste
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { appRouting } from './app.routing';
// ... reste
  imports: [
	  // ReactiveFormsModule,
	  // FormsModule,
	  appRouting 
	  // ...
  ],
// ... reste
```

On va déplacer quasiment tout le fichier vers **all-todos.component**,
reste que la mise en place du **router-outlet**
*/app.component.ts*
```javascript
import { Component } from '@angular/core';

@Component({
	// ...reste
  template: `<router-outlet></router-outlet>`
})

export class AppComponent{ }
```

 *modules/todo-list/todo-list.routing.ts*  
```javascript
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
 *modules/todo-list/todo-list.module.ts*  
```javascript
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
le **TodoListComponent** va servir de parent qui va lier nos deux autres components avec un autre **router-outlet**
 *modules/todo-list/todo-list.component.ts*  
```javascript
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

 *modules/todo-list/components/all-todos/all-todo.component.ts*  
```javascript
import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from '@Actions/todo-list.action';
import { AppState } from '@StoreConfig';
import { Todo } from '@Models/todo';
import { selectTodos$ } from '@Selectors/todo-list.selector';
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
      userId: 1, // userId au pif
      id: this.todosLength + 1
    };
    this.store.dispatch(new TodoListModule.CreateTodo(todo));
    this.todoForm.reset();
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }

}

```
Petite pause avec la nouvelle architecture le dossier **store/** commence à être vraiment loin de nos composants , résultat les imports ressemble plus à rien.
Pour palier ce problème on peut créer les **alias** via le **tsconfig.json** :

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
Avec ces options en plus on va pouvoir écrire :

  *modules/todo-list/components/all-todos/all-todo.component.ts*  
```javascript
import { AppState } from '@StoreConfig';
import { selectTodos$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
```
Plutôt cool non si votre IDE indique une erreur redémarrer-le. Voilà le point refacto est terminé passons à l'update de todo !

### Fin de la branche step-4

## Update Todo

### Début de la branche step-5

On va rajouter un propriété dans le **TodoListState** de sauvegarder une todo, on va modifier l'interface, les actions et le reducer pour pouvoir ajouter cette logique.

*models/todo.ts*
```javascript
export interface TodoListState {
	// ... other
	selectTodo: Todo
}
```

*store/actions/todo-list.action.ts*
```javascript
export namespace TodoListModule {
	export enum ActionTypes {
		// ... other
		SELECT_TODO = '[todoList] Select Todo',
		UPDATE_TODO = '[todoList] Update Todo'
	}
	// ... other
	export class SelectTodo {
		readonly type = ActionTypes.SELECT_TODO;
		constructor(payload: Todo){}
	}
	
	export class UpdateTodo {
		readonly type = ActionTypes.UPDATE_TODO;
		constructor(payload: Todo){}
	}
	// ... other
	export type Actions = InitTodos
	| SelectTodo
	| DeleteTodo;
}
```

*/store/reducers/todo-list.reducer.ts*
```javascript
import { TodoListModule } from '../actions/todo-list.action';
import { TodoListState  } from '../../models/todo';
import { todosMock } from '../../mocks/todo-list';

const initialState: TodoListState = {
	// ... other
	selectTodo: undefined
};

export function todosReducer(
// ... other

    case TodoListModule.ActionTypes.SELECT_TODO:
	    return {
			...state,
			selectTodo: action.payload
		};
		
	case TodoListModule.ActionTypes.UPDATE_TODO:
	    return {
			...state,
			data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
			})
		};
	
		
// ... other      
```
Mettre à jour le all-todos pour ajouter un bouton selectTodo qui va lançer l'action de **SELECT_TODO** et faire un navigate sur la page de todo-select 
```javascript
import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from '@Actions/todo-list.action';
import { AppState } from '@StoreConfig';
import { Todo } from '@Models/todo';
import { selectTodos$, selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-todos',
  styleUrls: ['./all-todos.component.scss'],
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
      <li *ngFor="let todo of todos$ | async; let i = index" >
        <label>{{ i }} - {{ todo.title }}</label>
        <input type="checkbox" [ngModel]="todo.completed"/>
        <button (click)="deleteTodo(todo.id)">Supprimer</button>
        <button (click)="selectTodo(todo)">Modifier</button>
      </li>
    </ul>
  `
})
export class AllTodosComponent implements OnInit {

  public todos$: Observable<Todo[]>;
  public todoForm: FormGroup;
  private todosLength: number;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodos$),
        tap((todos) => {
          console.log('selectTodos', todos);
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
      userId: 1, // userId au pif
      id: this.todosLength + 1
    };
    this.store.dispatch(new TodoListModule.CreateTodo(payload));
    this.todoForm.reset();
  }

  selectTodo(todo) {
    console.log('select', todo);
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    return this.router.navigate(['/todo-list/select-todo']);
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }
}
```


Cette fonctionnalité va être mis dans le **SelectTodoComponent** avec un formulaire assez semblable à celui de la création de todo.

 *modules/todo-list/components/select-todo/select-todo.component.ts*  
```javascript
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@StoreConfig';
import { selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListState, Todo } from '@Models/todo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-todo',
  styleUrls: ['./select-todo.component.scss'],
  template: `
      <h1>Mettre à jour la todo</h1>
      <form *ngIf="selectTodo$ | async; else NoElement" [formGroup]="updateTodoForm" (ngSubmit)="updateTodo(updateTodoForm.value)">
          <label>Titre :</label>
          <input type="text" formControlName="title" placeholder="Title"/>
          <label>Est-elle terminé ? :</label>
          <input type="checkbox" formControlName="completed"/>
          <button>Mettre à jour</button>
    </form>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class SelectTodoComponent implements OnInit {

    public updateTodoForm: FormGroup;
    public selectTodo$: Observable<Todo>;
    public selectTodo: Todo;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
  this.selectTodo$ = store
  .pipe(
    select(selectTodoSelected$),
    tap(selectTodos => {
      this.selectTodo = selectTodos;
    })
  );

  this.selectTodo$.subscribe();

    this.updateTodoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }
  ngOnInit() {
    if (this.selectTodo) {
      this.updateTodoForm.patchValue({
        title: this.selectTodo.title,
        completed: this.selectTodo.completed
      });
    }
  }

  updateTodo(formValue) {
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.UpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }

}

```
### Fin de la branche step-5
## API
### Début de la branche step-6


Voilà on a maintenant toutes nos fonctionnalités : **Create, Update, Delete** on va pouvoir commencer a inclure les requêtes **http**, pour cela on va prendre le module npm de  **[JsonPlaceholder](https://jsonplaceholder.typicode.com/)** avec **npm install -g json-server**.
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

A partir de la vous devez checkout la **step-6** pour avoir le styles qui a été réaliser à la fin de cette branche.

## BONUS TIME !!

### Début de la branche step-7

Pour le moment c'est toujours **AllTodosComponent** qui a la main sur le **LoadInitTodos** mais on peut l'extraire également et l'intégrée a un **Guard Angular** qui vérifiera si la donnée est déjà chargée ( vérifiable par la propriété loaded ) dans le cas ou il n'y a pas de donnée, il enverra l'action **LoadInitTodos**.

*Générer un guard*
```bash
ng g guard guards/is-todos-loaded/is-todos-loaded
```
Et le déclarer dans le **AppModule** :

```javascript
// ... Other
import { IsTodosLoadedGuard } from './guards/is-todos-loaded/is-todos-loaded.guard';
// ... Other


@NgModule({
  declarations: [
    // ... Other
  ],
  imports: [
    // ... Other
  ],
  providers: [
    // ... Other
    IsTodosLoadedGuard
  ],
  // ... Other
```

*guards/is-todos-loaded/is-todos-loaded.guard*

```javascript
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AppState } from '@StoreConfig';
import { map } from 'rxjs/operators';
import { selectTodosLoaded$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';

@Injectable()
export class IsTodosLoadedGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.store
      .pipe(
        select(selectTodosLoaded$),
        map(isLoaded => {
          if (!isLoaded) {
            this.store.dispatch(new TodoListModule.LoadInitTodos());
          }
          return true;
        })
      );
  }
}
```
Ajouter le guard au niveau des routes :

 *app.routing.ts*  
```javascript
// ...Other
import { IsTodosLoadedGuard } from './guards/is-todos-loaded/is-todos-loaded.guard';
// ...Other
			{
		        path: 'todo-list',
		        loadChildren: './modules/todo-list/todo-list.module#TodoListModule',
		        canActivate: [IsTodosLoadedGuard]
		    },
// ...Other
```
Avec le guard plus besoin de charger l'action depuis le component :

```javascript
// ...other

	// ...other
	  /*
	  A supprimer
	  ngOnInit(){
		  this.store.dispatch(new TodoListModule.LoadInitTodos());
	  }
	  */
// ...other
```
Voilà une manière de charger la donnée avant même de charger un composant une idée de sortir encore plus le component de la logique.
## Redux Devtools
Il existe une super extension Chrome pour le dev avec redux: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=fr) 
pour l'installer sur le projet, il vous faut le package [@ngrx/store-devtools](https://github.com/ngrx/platform/blob/master/docs/store-devtools/README.md)

Et l'importer dans le root module: 
```javascript
// ... reste
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';


@NgModule({
  // ... other
  imports: [
	// ... other
    StoreDevtoolsModule.instrument({
      name: '[TODOLIST]',
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  // ... other
})
export class AppModule { }
```
<p align="center">
  <img src="https://d33wubrfki0l68.cloudfront.net/595e2922eee1bf85b801cdc86b8f7e135cc46ee0/0fd92/images/angular/store-devtools/store-devtools-screen.jpg">
</p>

L'outils permet de voir chaque changement de state, de garder l'historique, de exporté le state global et inversement et des charts sur les l'états de notre App.

### Début de la branche step-7

## Routes POST

### Début de la branche step-8

Maintenant on modifier notre action de création de todo pour inclure un appel serveur de la même façon de l'initialisation
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1NDQ0MTA0NTBdfQ==
-->