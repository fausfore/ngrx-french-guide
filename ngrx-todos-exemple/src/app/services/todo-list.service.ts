import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Todo } from '@Models/todo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class TodoListService {

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${environment.apiUrl}/todos`);
  }

  createTodo(body): Observable<Todo> {
    return this.http.post<Todo>(`${environment.apiUrl}/todos`, body);
  }

}
