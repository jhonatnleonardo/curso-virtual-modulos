import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componentes
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,    // ¡Exportado para que AppModule lo use!
    FooterComponent,    // ¡Exportado para que AppModule lo use!
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
