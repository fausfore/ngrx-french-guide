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
import { StoreModuleApply, appEffects } from '@StoreConfig';
import { environment } from 'environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

export const declarations = [
  AppComponent
];

export const imports = [
  ...StoreModuleApply.imports,
  appRouting,
  BrowserModule,
  HttpClientModule,
  BrowserAnimationsModule,
  ToastrModule.forRoot(),
  EffectsModule.forRoot(appEffects),
  StoreDevtoolsModule.instrument({
    name: '[TODOLIST]',
    maxAge: 25, // Retains last 25 states
    logOnly: environment.production // Restrict extension to log-only mode
  })
];

export const providers = [
  ...StoreModuleApply.providers,
  TodoListService,
  IsTodosLoadedGuard
];

@NgModule({
  declarations: [
    ...declarations
  ],
  imports: [
    ...imports
  ],
  providers: [
    ...providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

