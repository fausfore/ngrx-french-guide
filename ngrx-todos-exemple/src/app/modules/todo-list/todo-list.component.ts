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
