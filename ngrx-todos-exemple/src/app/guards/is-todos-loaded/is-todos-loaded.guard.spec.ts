import { TestBed, async, inject } from '@angular/core/testing';

import { IsTodosLoadedGuard } from './is-todos-loaded.guard';
import { StoreModule, Store } from '@ngrx/store';
import { REDUCER_TOKEN, getReducers, AppState, StoreModuleApply } from '@StoreConfig';
import { appRouting } from '../../app.routing';
import { APP_BASE_HREF } from '@angular/common';


describe('IsTodosLoadedGuard', () => {
  let store: Store<AppState>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        appRouting,
        ...StoreModuleApply.imports
      ],
      providers: [
        IsTodosLoadedGuard,
        ...StoreModuleApply.providers,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    });
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
  });


  it('should ...', inject([IsTodosLoadedGuard], (guard: IsTodosLoadedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
