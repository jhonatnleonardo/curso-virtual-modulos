import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { environment } from '../environments/environment';

// Módulos personalizados
import { SharedModule } from './shared/shared-module';
import { PagesModule } from './pages/pages-module';

// Inicializar Firebase
const firebaseApp = initializeApp(environment.firebaseConfig);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    PagesModule,
    FormsModule
  ],
  providers: [
    { provide: 'FIREBASE_APP', useValue: firebaseApp },
    { provide: 'FIRESTORE', useValue: firestore },
    { provide: 'AUTH', useValue: auth }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
