
# Getters & create todo

  

### *[Début de la branche step-2]*

Voici une petite explication de l'utilisation du Pipe **async** :

  

> Le **Pipe async** souscrit à un Observable ou une Promise et renvoie la dernière valeur qu'il a émise. Lorsqu'une nouvelle valeur est détectée, le canal asynchrone envoie un signale au component afin qu'il mette à jour la donnée.

> Lorsque le component est détruit, **le Pipe async se désinscrit automatiquement afin d'éviter les fuites de mémoire potentielles**.

  

La syntaxe de la liste de todos :

```html

<li *ngFor="let todo of (todos$ | async)?.data">

```

  

Cependant, en changeant l'argument du **select('todos')** par une fonction, on peut obtenir une syntaxe plus simplifiée :

  

```html

<li *ngFor="let todo of todos$ | async">

```

  

```javascript

this.todos$ = store.pipe(select((state) =>  state.todos.data)); // On cible directement la propriété data

```

  
  

## Le Pipe et les opérateurs RXJS

  

Avant de continuer sur nos fonctions getters **select**, un point sur le Pipe RXJS s'impose.

  
  

> Le Pipe permet de réaliser un chaînage d'opérateurs RXJS de manière plus lisible.

  

*Exemple de Pipe :*

```javascript

const { Observable } = require('rxjs/Rx')

const { filter, map, reduce } = require('rxjs/operators')

const { Pipe } = require('rxjs/Rx')

  

const  filterOutEvens = filter(x  =>  x % 2)

const  doubleBy = x  =>  map(value  =>  value \* x);

const  sum = reduce((acc, next) =>  acc \+ next, 0);

const  source$ = Observable.range(0, 10)

  

source$

.Pipe(

filterOutEvens,

doubleBy(2),

sum

).subscribe(console.log); // 50

```

  

Pour voir un aperçu des différents opérateurs: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html

  
  

## Les States Selectors

  

La fonction **select** de NGRX peut prendre une fonction en paramètre.
On peut donc déporter cette logique et la stocker dans un fichier dédié.
Grâce à la fonction **createSelector**, on pourra composer des sélecteurs à partir d'autres sélecteurs.

  

*store/selectors/todo-list.selector.ts*

```javascript

import { createSelector } from  '@ngrx/store';

// La première fonction amène vers le state todos
export const selectTodoListState$ = (state: AppState) =>  state.todos;

// Et à partir de celle-ci, on créer une autre fonction qui renverra data
export const selectTodos$ = createSelector(selectTodoListState$,(todos) =>  todos.data);
```

*/app.component.ts*

```javascript
import { selectTodos } from  'store/selectors/todo-list.selector';

// [...]

// On remplace la fonction par le sélecteur
this.todos$ = store.pipe(select(selectTodos$));

```

## Créer une todo

Utiliser un formulaire pour créer une todo grâce au **FormsBuilder** d'Angular. 
La fonction **createTodo** renverra la future action de création dans le reducer.

*/app.component.ts*

```javascript
import { Store, select } from  '@ngrx/store';
import { OnInit, Component, Inject } from  '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Observable } from  'rxjs/Observable';
import { TodoListModule } from  './store/actions/todo-list.action';
import { AppState } from  './store';
import { Todo } from  './models/todo';
import { selectTodos$ } from  './store/selectors/todo-list.selector';

@Component({
selector:  'app-root',
styleUrls: ['./app.component.scss'],
template:  `
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
export  class  AppComponent  implements  OnInit {

todos$: Observable<Todo[]>;
public  todoForm: FormGroup;

constructor(
	private  store: Store<AppState>,
	@Inject(FormBuilder) fb: FormBuilder
) {
	this.todos$ = store.Pipe(select(selectTodos$));
	this.todoForm = fb.group({
		title: ['', Validators.required],
		completed: [false, Validators]
	});
}

createTodo(todo: Todo) {
const  payload = {
	...todo,
	userId: 1,
	id:  8  
};

this.store.dispatch(new  TodoListModule.CreateTodo(payload));
	this.todoForm.reset();
}

ngOnInit() {
	this.store.dispatch(new  TodoListModule.InitTodos());
}
 
}

```
N'oubliez pas de charger les modules pour utiliser les formulaires d'Angular.

*/app.module.ts*

```javascript
// [...]
import { ReactiveFormsModule, FormsModule } from  '@angular/forms';
// [...]

	imports: [
		ReactiveFormsModule,
		FormsModule,

		// [...]

	],

// [...]

```

  

Créer l'action pour le reducer :

  

*store/actions/todo-list.action.ts*

```javascript
import { Todo } from  '../../models/todo';

export  namespace  TodoListModule {

	export  enum  ActionTypes {

		// [...]

		CREATE_TODO = '\[todoList\] Create Todo',

	}

	// [...]

	export  class  CreateTodo {
		readonly  type = ActionTypes.CREATE_TODO;
		constructor(public  payload: Todo) {}
	}
	  
	export  type  Actions = InitTodos | CreateTodo;

}

```
Cette action transmet un **payload** qui sera la nouvelle todo à ajouter à notre tableau :

*/store/reducers/todo-list.reducer.ts*

```javascript
// [...]
case  TodoListModule.ActionTypes.CREATE_TODO:

return {
...state,
data: [
...state.data,
action.payload
]
};

// [...]

```

Voilà notre action \*\*createTodo\*\* est terminée, il reste des choses à revoir comme la gestion des ids.
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTIxNDUyNjU2NDEsMjEyMjc0ODA4OV19
-->