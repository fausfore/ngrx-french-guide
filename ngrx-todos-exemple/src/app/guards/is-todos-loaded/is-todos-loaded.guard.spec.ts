import { TestBed, async, inject } from '@angular/core/testing';

import { IsTodosLoadedGuard } from './is-todos-loaded.guard';

describe('IsTodosLoadedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsTodosLoadedGuard]
    });
  });

  it('should ...', inject([IsTodosLoadedGuard], (guard: IsTodosLoadedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
