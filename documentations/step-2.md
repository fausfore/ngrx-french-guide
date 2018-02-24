# Getters & create todo

### *[Début de la branche step-2]*
Avant de continuer voici une petite explication de l'utilisation du pipe **async** :

> Le **pipe async** souscrit à un Observable ou une Promise et renvoie la dernière valeur qu'il a émise. Lorsqu'une nouvelle valeur est détecté, le canal asynchrone envoie un signale au component afin qu'il met à jour la donnée. 
> Lorsque le composant est détruit, **le pipe async se désinscrit automatiquement pour éviter les fuites de mémoire potentielles**.

Voilà nos todos s'affiche bien dans la page mais faire se serait mieux de renvoyer on pourrai faire mieux avec ce **(todos$ | async)?.data** pourquoi ne pas faire **todos$ | async**.

 Pour changer cela il faut comprendre quelque chose au niveau du **select('todos')**.

Actuellement il renvoi le **contenu entier** du reducer todos avec le loaded et le loading , on peut modifier notre sélecteur pour que l'on reçoive uniquement les todos et pour cela au lieu de lui passer une string en paramètre on peut lui passer une fonction.

```html
<li *ngFor="let todo of todos$ | async">
```
```javascript
this.todos$ = store.pipe(select((state) => state.todos.data));
```
De cette manière on cible directement la propriété **data**.

## Le Pipe et les opérateurs RXJS

Avant de continuer sur nos fonction getters (**select**), un point sur les pipes RXJS s'impose.

Pour voir un peu les différents opérateurs: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html

> Le Pipe permet de réaliser un chaînage d'opérateurs RXJS de manière plus lisible.

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
Ceci nous offrira un large choix de traitement possible sur **getteurs** qui sont des observables. Maintenant revenons à notre sujet initial.

## States Selectors

Vu que la fonction **select()** de NGRX peut prendre une function en paramettre   

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

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTU1MjM3MDcxMCwyMTIyNzQ4MDg5XX0=
-->