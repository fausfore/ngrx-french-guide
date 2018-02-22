import { TodoListModule } from '@Actions/todo-list.action';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Todo } from '@Models/todo';
import { select, Store } from '@ngrx/store';
import { selectTodoListEntitiesConverted$ } from '@Selectors/todo-list.selector';
import { AppState } from '@StoreConfig';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-all-todos',
  styleUrls: ['./all-todos.component.scss'],
  template: `
    <h1>la todolist redux style !</h1>
    <form [formGroup]="todoForm" (ngSubmit)="createTodo(todoForm.value)" class="form">
      <div class="form-field">
        <label class="title">Titre :</label>
        <input type="text" formControlName="title" placeholder="Title"/>
      </div>
      <div class="form-field">
        <label class="title inline">Est-elle terminé ? :</label>
        <label class="checkbox-container">
          <input type="checkbox" formControlName="completed"/>
          <span class="checkmark"></span>
        </label>
      </div>
      <button class="btn primary">Ajouter une todo</button>
    </form>
    <ul>
      <li *ngFor="let todo of todos$ | async; let i = index" >
        <p>{{ i }} - {{ todo.title }}</p>
        <label class="isDone" [ngClass]="{ 'clear' : todo.completed  }">{{ todo.completed ? 'terminé' : 'En cours...' }}</label>
        <div class="button-area centerY">
          <button class="btn alert" (click)="deleteTodo(todo.id)">Supprimer</button>
          <button class="btn primary" (click)="selectTodo(todo)">Modifier</button>
        </div>
      </li>
    </ul>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class AllTodosComponent {

  public todos$: Observable<Todo[]>;
  public todoForm: FormGroup;
  private todosLength: number;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder,
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodoListEntitiesConverted$),
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

  createTodo(todo: Todo) {
    const payload = {
      ...todo,
      userId: 1, // userId au pif
    };
    this.store.dispatch(new TodoListModule.LoadCreateTodo(payload));
    this.todoForm.reset();
  }

  selectTodo(todo) {
    console.log('select', todo);
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    return this.router.navigate(['/todo-list/select-todo']);
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.LoadDeleteTodo(id));
  }

}
