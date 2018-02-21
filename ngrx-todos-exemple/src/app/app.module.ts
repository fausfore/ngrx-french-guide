import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { appRouting } from './app.routing';
import { IsTodosLoadedGuard } from './guards/is-todos-loaded/is-todos-loaded.guard';
import { TodoListService } from './services/todo-list.service';
import { appEffects, getReducers, REDUCER_TOKEN } from './store';
import { environment } from 'environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    appRouting,
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot(REDUCER_TOKEN),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({
      name: '[TODOLIST]',
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  providers: [
    {
      provide: REDUCER_TOKEN,
      useFactory: getReducers
    },
    TodoListService,
    IsTodosLoadedGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

