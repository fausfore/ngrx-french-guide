import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@StoreConfig';
import { selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListState, Todo } from '@Models/todo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-todo',
  styleUrls: ['./select-todo.component.scss'],
  template: `
      <h1>Mettre à jour la todo</h1>
      <form *ngIf="selectTodo$ | async; else NoElement" [formGroup]="updateTodoForm" (ngSubmit)="updateTodo(updateTodoForm.value)">
          <label>Titre :</label>
          <input type="text" formControlName="title" placeholder="Title"/>
          <label>Est-elle terminé ? :</label>
          <input type="checkbox" formControlName="completed"/>
          <button>Mettre à jour</button>
    </form>
    <ng-template #NoElement>Pas de todo séléctionner<ng-template>
  `
})
export class SelectTodoComponent implements OnInit {

    public updateTodoForm: FormGroup;
    public selectTodo$: Observable<Todo>;
    public selectTodo: Todo;

  constructor(
    private store: Store<AppState>,
    private router: Router
    @Inject(FormBuilder) fb: FormBuilder
  ) {
  this.selectTodo$ = store
  .pipe(
    select(selectTodoSelected$),
    tap(selectTodos => {
      console.log('HERE');
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
    console.log(formValue);
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.UpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }

}

