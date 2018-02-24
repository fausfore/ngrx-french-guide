
## Delete todo

### *[Début de la branche step-3]*

Même procédé que pour la création, cette fois on va passer l'id de la todo a supprimée dans le reducer.

*store/actions/todo-list.action.ts*
```javascript
// ... autres
export namespace TodoListModule {

    export enum ActionTypes {
        // ... autres
        DELETE_TODO = '[todoList] Delete Todo',
    }

	// ... autres

    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }

    export type Actions = InitTodos
        | CreateTodo
        | DeleteTodo;
}
```
On va se servir de **filter** pour renvoyer un nouveau tableau sans notre todo.

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
Ajoutons la fonction de suppréssion.
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

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTMwNjk5NzgzNywyMTc1Nzc1MjJdfQ==
-->