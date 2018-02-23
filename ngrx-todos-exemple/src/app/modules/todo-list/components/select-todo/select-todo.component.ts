import { TodoListModule } from '@Actions/todo-list.action';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Todo } from '@Models/todo';
import { select, Store } from '@ngrx/store';
import { selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { AppState } from '@StoreConfig';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-todo',
  styleUrls: ['./select-todo.component.scss'],
  template: `
  <article class="select-todo-content">
    <h1>Mettre à jour la todo</h1>
    <form class="form" *ngIf="selectTodo$ | async; else NoElement"
      [formGroup]="updateTodoForm"
      (ngSubmit)="updateTodo(updateTodoForm.value)">
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
      <button class="btn primary">Mettre à jour</button>
    </form>
  </article>
  <ng-template #NoElement>
    <h2 class="centerXY">Pas de todo séléctionnée...</h2>
  <ng-template>
  `
})
export class SelectTodoComponent implements OnInit {

    public updateTodoForm: FormGroup;
    public selectTodo$: Observable<Todo>;
    public selectTodo: Todo;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
  this.selectTodo$ = store
  .pipe(
    select(selectTodoSelected$),
    tap(selectTodos => {
      this.selectTodo = selectTodos;
    })
  );

  this.selectTodo$.subscribe();

    this.updateTodoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }
  ngOnInit() {
    if (this.selectTodo) {
      this.updateTodoForm.patchValue({
        title: this.selectTodo.title,
        completed: this.selectTodo.completed
      });
    }
  }

  updateTodo(formValue) {
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.UpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }

}

