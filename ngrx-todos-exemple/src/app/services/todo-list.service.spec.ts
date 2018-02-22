import { TestBed, inject } from '@angular/core/testing';

import { TodoListService } from './todo-list.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodoListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [TodoListService]
    });
  });

  it('should be created', inject([TodoListService], (service: TodoListService) => {
    expect(service).toBeTruthy();
  }));
});
