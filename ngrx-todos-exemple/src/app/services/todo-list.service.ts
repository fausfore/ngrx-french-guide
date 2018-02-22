import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Todo } from '@Models/todo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoListService {

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${environment.apiUrl}/todos`);
  }

  createTodo(body): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}/todos`, body);
  }

  deleteTodo(id): Observable<number> {
    return this.http.delete<Todo>(`${environment.apiUrl}/todos/${id}`)
    // Le pipe va nous renvoyer l'id de la todo si la suppression
    // est réussi
      .pipe(
        map((response) => id)
      );
  }

}
