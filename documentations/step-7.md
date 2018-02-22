## BONUS TIME !!

A partir de la vous devez checkout la **step-6** pour avoir le styles qui a été réaliser à la fin de cette branche.


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

### Fin de la branche step-7
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTkyNzk5OTc0OV19
-->