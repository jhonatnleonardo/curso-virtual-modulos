import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  totalModulos = 0;
  modulosRecientes = [
    { nombre: 'Introducción a Angular', descripcion: 'Fundamentos básicos', nivel: 'principiante', horas: 10 },
    { nombre: 'Firebase y Firestore', descripcion: 'Base de datos en tiempo real', nivel: 'intermedio', horas: 8 },
    { nombre: 'Diseño con Bootstrap', descripcion: 'Estilos responsive', nivel: 'principiante', horas: 6 }
  ];

  features = [
    { icon: 'fas fa-book', title: 'Gestión de Módulos', description: 'Crea, edita y organiza módulos de aprendizaje' },
    { icon: 'fas fa-users', title: 'Para Estudiantes', description: 'Interfaz intuitiva para el aprendizaje' },
    { icon: 'fas fa-chart-line', title: 'Seguimiento', description: 'Monitorea el progreso educativo' },
    { icon: 'fas fa-mobile-alt', title: 'Responsive', description: 'Accede desde cualquier dispositivo' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuarioActual$.subscribe(user => {
      this.isAuthenticated = !!user;
    });

    // Simular datos (en producción vendrían del servicio)
    this.totalModulos = 15;
  }

  getBadgeClass(nivel: string): string {
    switch(nivel) {
      case 'principiante': return 'badge-beginner';
      case 'intermedio': return 'badge-intermediate';
      case 'avanzado': return 'badge-advanced';
      default: return 'badge-secondary';
    }
  }
}
