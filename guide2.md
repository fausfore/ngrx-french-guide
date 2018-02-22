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

## POST TODO

### Début de la branche step-8

Maintenant on modifier notre action de création de todo pour inclure un appel serveur de la même façon de l'initialisation donc au lieu s'avoir que une action CREATE_TODO, on aura un **LOAD_CREATE_TODO** et un **SUCCESS_CREATE_TODO**

*todo-list.action.ts*
```javascript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
	    // ... Other
        LOAD_CREATE_TODO = '[todoList] Load Create Todo',
        SUCCESS_CREATE_TODO = '[todoList] Success Create Todo',
        ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // CREATE_TODO = '[todoList] Create Todo',
    }
	// ... Other
	/*
    export class CreateTodo {
        readonly type = ActionTypes.CREATE_TODO;
        constructor(public payload: Todo) {}
    }
    */

    export class LoadCreateTodo {
        readonly type = ActionTypes.LOAD_CREATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessCreateTodo {
        readonly type = ActionTypes.SUCCESS_CREATE_TODO;
        constructor(public payload: Todo) {}
    }
    
    export class ErrorCreateTodo {
        readonly type = ActionTypes.ERROR_CREATE_TODO;
    }
    // ... Other
    export type Actions = DeleteTodo
        | LoadCreateTodo
        | SuccessCreateTodo
        | ErrorCreateTodo
        // ... Other
        //| CreateTodo;
}

```
On update le reducer avec les nouvelles actions:
```javascript
// ...Other
todosReducer(
    state: TodoListState = initialState,
    action: TodoListModule.Actions
): TodoListState {

  switch (action.type) {

	// ...Other
    case TodoListModule.ActionTypes.LOAD_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: false,
            data: [
                ...state.data,
                action.payload
            ]
        };

    case TodoListModule.ActionTypes.ERROR_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: false
        };

	/*
    case TodoListModule.ActionTypes.CREATE_TODO:
        return {
            ...state,
            data: [
                ...state.data,
                action.payload
            ]
        };
     */

    // ...Other

    default:
        return state;
    }
}

```
On créer un service de post: 
```javascript
// ... Other
@Injectable()
export class TodoListService {

 // ... Other

  createTodo(body): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}/todos`, body);
  }

}
```
On ajoute un effect qui listen l'action de LOAD_CREATE_TODO:

```javascript
// ...Other

@Injectable()
export class TodoListEffects {
  // ...Other

    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadCreateTodo>(TodoListModule.ActionTypes.LOAD_CREATE_TODO),
          switchMap(action => this.todoListService.createTodo(action.payload)),
          map(todo => new TodoListModule.SuccessCreateTodo(todo)),
          catchError(() => of(new TodoListModule.ErrorInitTodos()))
      );

  constructor(
    private todoListService: TodoListService,
    private actions$: Actions
  ) {}
}

```
Maintenant reste plus que a changer l'action lors du click et retirer la notion de id car le serveur donnera son propre id
*all-todos.ts*
```javascript
// private todosLength: number;
// ... Other
this.todos$ = store
      .pipe(
        select(selectTodos$),
        /*tap((todos) => {
          console.log('selectTodos', todos);
          this.todosLength = todos.length;
        }) */
    );
// ... Other
createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
      // id: this.todosLength + 1
    };
    // this.store.dispatch(new TodoListModule.CreateTodo(payload));
    this.store.dispatch(new TodoListModule.LoadCreateTodo(payload));
    this.todoForm.reset();
  }
```
### Fin de la branche step-8

## DELETE TODO

### Début de la branche step-9

Maintenant voyons la suppression avec un vrai delete serveur comme pour le post il nous faudra un effect, ajouter un action de type **Load**

Les actions :
*todo-list.action.ts*

```javascript
import { Todo } from '../../models/todo';

export namespace TodoListModule {

    export enum ActionTypes {
        // Delete Todo
        // DELETE_TODO = '[todoList] Delete Todo',
        LOAD_DELETE_TODO = '[todoList] Load Delete Todo',
        SUCCESS_DELETE_TODO = '[todoList] Success Delete Todo',
        ERROR_DELETE_TODO = '[todoList] Error Delete Todo'
        // ...Other
    }

    // ... Other

    // DELETE TODO
    /*
    export class DeleteTodo {
        readonly type = ActionTypes.DELETE_TODO;
        constructor(public payload: number) {}
    }
    */

    export class LoadDeleteTodo {
        readonly type = ActionTypes.LOAD_DELETE_TODO;
        constructor(public payload: number) {}
    }

    export class SuccessDeleteTodo {
        readonly type = ActionTypes.SUCCESS_DELETE_TODO;
        constructor(public payload: number) {}
    }
    
	export class ErrorDeleteTodo {
	    readonly type = ActionTypes.ERROR_DELETE_TODO;
	}

    export type Actions = LoadInitTodos
        // ... other
        | LoadDeleteTodo
        | ErrorDeleteTodo
        | SuccessDeleteTodo;
        // | DeleteTodo;

}

``` 
Créer les reducers correspondante: 
```javascript
// ... Other
    // DELETE TODO

    case TodoListModule.ActionTypes.LOAD_DELETE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };
        
    case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        };
        
    /*
    case TodoListModule.ActionTypes.DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload)
        };

    */
// ... Other
```
Modifier l'action passé dans le template :

*all-todos.component.ts*
```javascript
// ... other
deleteTodo(id: number) {
	this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
}
// ... other

```
Et créer le service delete Todo, pour renvoyer l'id lors de la requête, on lui ajoute un pipe qui renvoie l'id du paramètre si 200

*todo-list.service.ts*
```javascript
// ... other
deleteTodo(id): Observable<number> {
    return this.http.delete<Todo>(`${environment.apiUrl}/todos/${id}`)
    // Le pipe va nous renvoyer l'id de la todo si la suppression
    // est réussi
      .pipe(
        map((response) => id)
      );
  }
// ... other

```
Voilà pour la suppression.

### Fin de la branche step-9

## PATCH TODO

### Début de la branche step-10

Vous commencez à être habitué, on modifie l'action:

*todo-list.action.ts*
```javascript
// ... other
export namespace TodoListModule {

    export enum ActionTypes {
        // ... other
        // UPDATE_TODO = '[todoList] Update Todo',
        LOAD_UPDATE_TODO = '[todoList] Load Update Todo',
        SUCCESS_UPDATE_TODO = '[todoList] Success Update Todo',
        ERROR_UPDATE_TODO = '[todoList] Error Update Todo',
        // ... other
    }
    // ... other
    // PATCH TODO
    /*
    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }
    */
    export class LoadUpdateTodo {
        readonly type = ActionTypes.LOAD_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class SuccessUpdateTodo {
        readonly type = ActionTypes.SUCCESS_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    export class ErrorUpdateTodo {
        readonly type = ActionTypes.ERROR_UPDATE_TODO;
        constructor(public payload: Todo) {}
    }

    // ... other

    export type Actions = LoadInitTodos
        // ... other
        // | UpdateTodo
        | LoadUpdateTodo
        | ErrorUpdateTodo
        | SuccessUpdateTodo;

}

```
*todo-list.reducer.ts*
```javascript
// ... other
   // PATCH TODO
    /*
    case TodoListModule.ActionTypes.UPDATE_TODO:
        return {
            ...state,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        */

    case TodoListModule.ActionTypes.LOAD_UPDATE_TODO:
        return {
            ...state,
            loading: true
        };

    case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        return {
            ...state,
            loading: false,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        
     case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        }
// ... other
```
Le nouveau effect: 

*todo-list.effect.ts*
```javascript
// ... other
 @Effect() LoadUpdateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          ofType<TodoListModule.LoadUpdateTodo>(TodoListModule.ActionTypes.LOAD_UPDATE_TODO),
          switchMap(action => {
            const { id, ...changes } = action.payload;
            return this.todoListService.patchTodo(changes, id);
          }),
          map(todo => new TodoListModule.SuccessUpdateTodo(todo)),
          catchError(() => of(new TodoListModule.ErrorCreateTodo()))
      );
```
On créer le service de path : 

*todo-list.service.ts*
```javascript
// ... other
patchTodo(changes: Partial<Todo>, id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${environment.apiUrl}/todos/${id}`, changes);
}
```
Et on change l'action dans le component: 

*select-todo.component.ts*
```javascript
// ... other
updateTodo(formValue) {
    console.log(formValue);
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.LoadUpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }
```

### Fin de la branche step-10

## ERROR LOG

### Début de la branche step-11

Voilà le **mvp** de la todoList est terminé, sur la suite du tutoriel on va voir comment optimiser notre code et le 1er point c'est concernant les actions d'erreurs qui dans le reducer sont répété in fine par action, on pourrait les fusionné pour n'avoir que un state d'erreur todo-list :

*todo-list.action.ts*
```javascript
// ... Other
export namespace TodoListModule {

    export enum ActionTypes {
	    // ... Other
        // ERROR_CREATE_TODO = '[todoList] Error Create Todo',
        // ERROR_UPDATE_TODO = '[todoList] Error Update Todo',
        // ERROR_DELETE_TODO = '[todoList] Error Delete Todo',
        // ERROR_INIT_TODOS = '[todoList] Error Init Todos',
        // Error request Todos
        ERROR_LOAD_ACTION = '[todoList] Error Load Action'
    }

	// ... Other
    /*
    export class ErrorInitTodos {
        readonly type = ActionTypes.ERROR_INIT_TODOS;
    }
    // ... Other
    /*
    export class ErrorCreateTodo {
        readonly type = ActionTypes.ERROR_CREATE_TODO;
    }
    */
	// ... Other
    /*
    export class UpdateTodo {
        readonly type = ActionTypes.UPDATE_TODO;
        constructor(public payload: Todo) {}
    }
    */
	// ... Other
    /*
    export class ErrorUpdateTodo {
        readonly type = ActionTypes.ERROR_UPDATE_TODO;
    }
    */

    // ... Other
    
    /*
    export class ErrorDeleteTodo {
        readonly type = ActionTypes.ERROR_DELETE_TODO;
    }
    */

    // ERROR ACTIONS

    export class ErrorLoadAction {
        readonly type = ActionTypes.ERROR_LOAD_ACTION;
    }

    export type Actions = LoadInitTodos
        // ... other
        // | ErrorInitTodos
        // | ErrorCreateTodo
        // | ErrorUpdateTodo
        // | ErrorDeleteTodo

}

```
*todo-list.reducer.ts*
```javascript
// ... other
  switch (action.type) {

    // ... other
    /*
    case TodoListModule.ActionTypes.ERROR_INIT_TODOS:
        // Error rend le loading a false
        return {
            ...state,
            loading: false
        };*/

    // ... other
    /*
    case TodoListModule.ActionTypes.ERROR_CREATE_TODO:
        // Passe le loading a true
        return {
            ...state,
            loading: false
        };*/

    // ... other
    /*
    case TodoListModule.ActionTypes.UPDATE_TODO:
        return {
            ...state,
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };
        */

    // ... other
    /*
    case TodoListModule.ActionTypes.ERROR_UPDATE_TODO:
        return {
            ...state,
            loading: false
        };*/


    // ... other
    /*
    case TodoListModule.ActionTypes.ERROR_DELETE_TODO:
        return {
            ...state,
            loading: false
        };*/

    case TodoListModule.ActionTypes.ERROR_LOAD_ACTION:
        return {
            ...state,
            loading: false
        };

    // ... other
}

```
*todo-list.effect.ts*
```javascript
// ... other
@Injectable()
export class TodoListEffects {
  // Listen les actions passées dans le Store
    @Effect() LoadTodos$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // ... other
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadCreateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // ... other
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadDeleteTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
          // ... other
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );

    @Effect() LoadUpdateTodo$: Observable<TodoListModule.Actions> = this.actions$
      .pipe(
      // ... other
          catchError(() => of(new TodoListModule.ErrorLoadAction()))
      );
  // ... other
}

```
Voilà on a purger un peu de code inutile mais on peu créer un système de logs en cas d'erreur, il faut savoir que dans le catchError, il peut prendre en argument l'erreur :

```javascript
catchError((err) => of(new TodoListModule.ErrorLoadAction()))
```
Donc on peut récupérer cette erreur pour afficher le message dans un la view avec avec un **toastr**

*todo-list.action.ts*
```javascript
import { HttpErrorResponse } from '@angular/common/http';
// ... other
export class ErrorLoadAction {
    readonly type = ActionTypes.ERROR_LOAD_ACTION;
    constructor(public payload: HttpErrorResponse) {}
}
```
et passer l'erreur sur chaque actions dans les effects :

*todo-list.effect.ts*
```javascript
// ... other
catchError((err) => of(new TodoListModule.ErrorLoadAction(err)))
```
On ajoute une autre propriété qui permettra de garder les erreurs: 

*models/todo.ts*
```javascript
export interface TodoListState {
    // ... other
    logs: {
        type: string;
        message: string;
    };
}
```
Ajoutez cette propriété dans le reducer: 

*todo-list.reducer.ts*
```javascript
const initialState: TodoListState = {
    // ... other
    logs: undefined
};

case TodoListModule.ActionTypes.SUCCESS_DELETE_TODO:
        return {
            ...state,
            data : state.data.filter(todo => todo.id !== action.payload),
            logs: { type: 'SUCCESS', message: 'La todo à été suprimmé avec succès' }
        };

case TodoListModule.ActionTypes.SUCCESS_UPDATE_TODO:
        return {
            ...state,
            loading: false,
            logs: { type: 'SUCCESS', message: 'La todo à été mise à jour avec succès' },
            data: state.data
                .map(todo => action.payload.id === todo.id ? action.payload : todo)
        };

case TodoListModule.ActionTypes.SUCCESS_CREATE_TODO:
     return {
         ...state,
         logs: { type: 'SUCCESS', message: 'La todo à été crée avec succès' },
         data: [
             ...state.data,
             action.payload
         ]
     };
        
case TodoListModule.ActionTypes.ERROR_LOAD_ACTION:
    return {
        ...state,
        loading: false,
        logs: { type: 'ERROR', message: action.payload.message },
    };
```
On aura besoin d'un selector pour le logs: 

*todo-list.selector.ts*
```javascript
export const selectTodosErrors$ =
    createSelector(selectTodoListState$, (todos) => todos.logs);
```
Maintenant on installe le module [ngx-toastr](https://github.com/scttcper/ngx-toastr) et une fois que vous aurez tout bien installer allez dans le **TodoListComponent**

```javascript
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppState } from '@StoreConfig';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { selectTodosErrors$ } from '@Selectors/todo-list.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  template: `
	  <header>
		  <nav>
			  <a routerLink="all-todos" routerLinkActive="active">all todos</a>
			  <a routerLink="select-todo" routerLinkActive="active">select todo</a>
		  </nav>
	  </header>
	  <router-outlet></router-outlet>
  `,
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  public todoListErrors$: Observable<any>;

  constructor(
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {
    this.todoListErrors$ = store.pipe(
      select(selectTodosErrors$),
      tap((dialog) => {
        if (!dialog) {
          return;
        }
        if (dialog.type === 'ERROR') {
          this.toastr.error(dialog.message);
        } else {
          this.toastr.success(dialog.message);
        }
        console.log(dialog);
      })
    );
    this.todoListErrors$.subscribe();
  }

}

```

### Fin de la branche step-11

## NGRX - ENTITY

### Début de la branche step-12

Cette partie est consacré a de l'optimisation dans une todo-list
<!--stackedit_data:
eyJoaXN0b3J5IjpbODYyNzU0MjUzXX0=
-->