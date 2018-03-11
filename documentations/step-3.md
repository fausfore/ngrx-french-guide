
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

Jusqu'à présent, à chaque fois que l'on crée une todo, on lui donnait un id "8" par défaut. Nous allons maintenant dynamiser l'attribution d'id.

Deux possibilités : 

-1 Calculer la longueur du tableau de todo.
-2 Utiliser des id uniques via un générateur comme [uuid](https://www.npmjs.com/package/uuid).

Première option :

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
		  userId: 1,
		  id: this.todoslength + 1
	};
```
>**tap** : invoque une action pour chaque élément de la séquence observable.

Suppression est terminée.

### [Suite >>](https://github.com/fausfore/ngrx-french-guide/blob/master/documentations/step-4.md)

<!--stackedit_data:
eyJoaXN0b3J5IjpbODI2Mzk4NTEsMjE3NTc3NTIyXX0=
-->