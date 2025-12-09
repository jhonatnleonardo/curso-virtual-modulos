import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';

import { HomeComponent } from './home/home.component';
import { ModulosListComponent } from './modulos-list/modulos-list.component';
import { ModuloFormComponent } from './modulo-form/modulo-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    HomeComponent,
    ModulosListComponent,
    ModuloFormComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PagesModule { }
