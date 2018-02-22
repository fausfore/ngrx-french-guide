import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appRouting } from './app.routing';
import { APP_BASE_HREF } from '@angular/common';

import * as FromAppModule from './app.module';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FromAppModule.imports
      ],
      declarations: [
        FromAppModule.declarations
      ],
      providers: [
        FromAppModule.providers,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
