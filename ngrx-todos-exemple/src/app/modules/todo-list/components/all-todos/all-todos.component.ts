import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from '@Actions/todo-list.action';
import { AppState } from '@StoreConfig';
import { Todo } from '@Models/todo';
import { selectTodos$, selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-todos',
  styleUrls: ['./all-todos.component.scss'],
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
      <li *ngFor="let todo of todos$ | async; let i = index" >
        <label>{{ i }} - {{ todo.title }}</label>
        <input type="checkbox" [ngModel]="todo.completed"/>
        <button (click)="deleteTodo(todo.id)">Supprimer</button>
        <button (click)="selectTodo(todo)">Modifier</button>
      </li>
    </ul>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class AllTodosComponent implements OnInit {

  public todos$: Observable<Todo[]>;
  public todoForm: FormGroup;
  private todosLength: number;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodos$),
        tap((todos) => {
          console.log('selectTodos', todos);
          this.todosLength = todos.length;
        })
    );

    this.todoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }

  ngOnInit() {
    this.store.dispatch(new TodoListModule.InitTodos());
  }

  createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
      id: this.todosLength + 1
    };
    this.store.dispatch(new TodoListModule.CreateTodo(payload));
    this.todoForm.reset();
  }

  selectTodo(todo) {
    console.log('select', todo);
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    return this.router.navigate(['/todo-list/select-todo']);
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }

}
