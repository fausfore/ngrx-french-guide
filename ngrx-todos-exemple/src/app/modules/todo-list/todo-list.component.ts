import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  template: `
	  <header>
		  <nav>
			  <a routerLink="all-todos">all todos</a>
			  <a routerLink="select-todo">select todo</a>
		  </nav>
	  </header>
	  <router-outlet></router-outlet>
  `,
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent { }
