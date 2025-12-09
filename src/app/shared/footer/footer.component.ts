import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = {
    navegacion: [
      { label: 'Inicio', path: '/' },
      { label: 'Módulos', path: '/modulos' },
      { label: 'Nuevo Módulo', path: '/modulos/nuevo' }
    ],
    cuenta: [
      { label: 'Iniciar Sesión', path: '/login' },
      { label: 'Registrarse', path: '/register' },
      { label: 'Mi Perfil', path: '#' }
    ],
    recursos: [
      { label: 'Documentación', path: '#' },
      { label: 'Tutoriales', path: '#' },
      { label: 'API', path: '#' }
    ]
  };

  tecnologias = [
    { icon: 'fab fa-angular', name: 'Angular 19' },
    { icon: 'fas fa-fire', name: 'Firebase' },
    { icon: 'fab fa-bootstrap', name: 'Bootstrap 5' },
    { icon: 'fab fa-sass', name: 'Sass' },
    { icon: 'fab fa-js-square', name: 'TypeScript' }
  ];

  contactInfo = {
    estudiante: 'Gustavo Leonardo',
    tematica: 'Curso Virtual - Módulo',
    paleta: ['#CCFF99', '#66CC33', '#336600']
  };
}
