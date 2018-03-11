
# Delete todo

### *[Début de la branche step-3]*


Même procédé que pour la création, sauf que  l'on passera l'id de la todo à supprimer dans l'action.

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
Se servir de **filter** pour renvoyer un nouveau tableau sans notre todo :

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
Ajoutons la fonction de suppression :

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
eyJoaXN0b3J5IjpbMTExNTQyNDYzMSwyMTc1Nzc1MjJdfQ==
-->