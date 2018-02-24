
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
Ajoutons la fonction de suppression.
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
Voilà c'est fait !
Mais il y a un soucis pour le moment a chaque fois que l'on créer une nouvelle  todo on lui donne un id 8 ce qui pose un problème, il faut un id unique !

 Pour le moment on a deux options calculer la longueur du tableau de todo ou utiliser des id unique via un générateur comme [uuid](https://www.npmjs.com/package/uuid) mais la 1er option suffira pour le moment.

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
Voilà l'id s’incrémentera au fur est mesure que la collection grandit.
Pour cela on a ajouté un opérateur **tap** à l'intérieur du pipe, cela donne un 1er aperçu de ce chainage d'opérateursqui suis cette opérateur, en lui rajoutant un **tap()**.

>**tap** invoque une action pour chaque élément de la séquence observable.

Le truc intéressant aussi c'est que l'on a pu récupérer cette valeur **sans faire un subscribe sur l'observable selectTodos$** propre.
Voilà la suppression completed !

### Fin de la branche step-3

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTk5OTY2ODA3MiwyMTc1Nzc1MjJdfQ==
-->