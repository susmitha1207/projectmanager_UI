import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// import { MaterialModule } from './material-module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListFilter } from './app-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HeaderComponent } from './header/header.component';
import { TaskComponent } from './task/task.component';
import { ProjectComponent } from './project/project.component';
import { ViewtaskComponent } from './viewtask/viewtask.component';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [
  { path: '', redirectTo: "project", pathMatch: "full" },
  { path: 'user',          component: UserComponent    },
  { path: 'task/:id',         component: TaskComponent     },
  { path: 'project',       component: ProjectComponent },
  { path: 'viewtask',       component: ViewtaskComponent}];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HeaderComponent,
    TaskComponent,
    ProjectComponent,
    ViewtaskComponent,
    ListFilter,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    // NoopAnimationsModule,
    AppRoutingModule,
    // MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
