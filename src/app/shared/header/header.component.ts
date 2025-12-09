import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  usuarioEmail = '';
  usuarioNombre = '';
  private authSubscription: Subscription | null = null;

  // Menú de navegación
  menuItems = [
    { path: '/', icon: 'fas fa-home', label: 'Inicio' },
    { path: '/modulos', icon: 'fas fa-book', label: 'Módulos' },
    { path: '/modulos/nuevo', icon: 'fas fa-plus-circle', label: 'Nuevo Módulo', requiresAuth: true }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.usuarioActual$.subscribe({
      next: (user) => {
        this.isAuthenticated = !!user;
        this.usuarioEmail = user?.email || '';
        this.usuarioNombre = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
      },
      error: (error) => {
        console.error('Error en suscripción auth:', error);
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout().catch(error => {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión: ' + error.message);
    });
  }

  getUsuarioIniciales(): string {
    if (!this.usuarioNombre) return 'U';
    return this.usuarioNombre.charAt(0).toUpperCase();
  }

  shouldShowMenuItem(item: any): boolean {
    if (item.requiresAuth && !this.isAuthenticated) {
      return false;
    }
    return true;
  }
}
