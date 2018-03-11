
# Delete todo

### *[Début de la branche step-3]*


Même procédé que pour la création, sauf q on va passer l'id de la todo  supprimr dans le reducer.

*store/actions/todo-list.action.ts*
```javascript
// ... autres
export namespace TodoListModule {

    export enum ActionTypes {
        // [...]
        DELETE_TODO = '[todoList] Delete Todo',
    }

	// [...]

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
	// [...]
    case TodoListModule.ActionTypes.DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };
	// [...]
```
Ajoutons la fonction de suppression.

*/app.component.ts*
```javascript
// ...]
 template: `
    <!-- reste -->
	<li *ngFor="let todo of todos$ | async">
		<!-- reste -->
		<button (click)="deleteTodo(todo.id)">Supprimer</button>
	</li>
  `
    // ...]
  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }
}
```

## Gérer les ids

Jusqu'à présent, à chaque fois que l'on crée une nouvelle todo on lui donnaite un id "8" par défaut. Nous allons maintenant dynamiser l'attribution d'id.

Nous avons 2 possibilités :n calculer la longueur du tableau de todo,
- utiliser des id uniques via un générateur comme [uuid](https://www.npmjs.com/package/uuid) 

Nous utiliserons la première option.

*/app.component.ts*
```javascript
//[...]
import { tap } from 'rxjs/operators';
//[...]
private todoslength : number;
//[...]
this.todos$ = store
	.pipe(
		select(selectTodos$),
		tap((todos) => {
			this.todoslength = todos.length;
		})
	);
//[...]
CreateTodo(todo: Todo){
	const payload = {
		  ...todo,
		  userId: 1, // userId au pif
		  id: this.todoslength + 1
	};
```
>**tap** invoque une action pour chaque élément de la séquence observable.

Voilà la suppression est terminée  !

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ4NDk0Mzc0NywyMTc1Nzc1MjJdfQ==
-->