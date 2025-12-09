import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloService } from '../../core/services/modulo.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

// Usar tipo import
type Modulo = import('../../core/services/modulo.service').Modulo;

@Component({
  selector: 'app-modulos-list',
  templateUrl: './modulos-list.component.html',
  styleUrls: ['./modulos-list.component.scss'],
  standalone: false
  })
export class ModulosListComponent implements OnInit, OnDestroy {
  modulos: Modulo[] = [];
  filteredModulos: Modulo[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';
  currentFilter = 'todos';

  // Estadísticas calculadas
  totalModulos = 0;
  modulosActivos = 0;
  totalHoras = 0;
  totalInstructores = 0;

  // Texto del filtro actual
  currentFilterLabel = 'Todos';

  isAuthenticated = false;
  private authSubscription: Subscription | null = null;

  filters = [
    { value: 'todos', label: 'Todos', icon: 'fas fa-list' },
    { value: 'activo', label: 'Activos', icon: 'fas fa-check-circle' },
    { value: 'inactivo', label: 'Inactivos', icon: 'fas fa-times-circle' },
    { value: 'principiante', label: 'Principiante', icon: 'fas fa-star' },
    { value: 'intermedio', label: 'Intermedio', icon: 'fas fa-star-half-alt' },
    { value: 'avanzado', label: 'Avanzado', icon: 'fas fa-star' }
  ];

  constructor(
    private moduloService: ModuloService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarModulos();
    this.verificarAutenticacion();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  verificarAutenticacion(): void {
    this.authSubscription = this.authService.usuarioActual$.subscribe({
      next: (user) => {
        this.isAuthenticated = !!user;
      },
      error: (error) => {
        console.error('Error en autenticación:', error);
        this.isAuthenticated = false;
      }
    });
  }

  cargarModulos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.moduloService.getModulos().subscribe({
      next: (modulos) => {
        this.modulos = modulos;
        this.filteredModulos = [...modulos];
        this.calcularEstadisticas();
        this.actualizarFiltroLabel();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar módulos:', error);
        this.errorMessage = 'Error al cargar los módulos. Intenta de nuevo.';
        this.loading = false;
        this.cargarDatosEjemplo();
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalModulos = this.modulos.length;
    this.modulosActivos = this.modulos.filter(m => m.estado === 'activo').length;
    this.totalHoras = this.modulos.reduce((total, m) => total + m.duracionHoras, 0);
    this.totalInstructores = this.getUniqueInstructors().length;
  }

  cargarDatosEjemplo(): void {
    // Datos de ejemplo para cuando no hay conexión a Firebase
    this.modulos = [
      {
        id: '1',
        nombre: 'Introducción a Angular',
        descripcion: 'Fundamentos básicos de Angular para principiantes',
        duracionHoras: 10,
        nivelDificultad: 'principiante',
        contenido: ['Componentes', 'Directivas', 'Servicios'],
        instructor: 'Profesor Ejemplo',
        estado: 'activo'
      },
      {
        id: '2',
        nombre: 'Firebase y Firestore',
        descripcion: 'Base de datos en tiempo real y autenticación',
        duracionHoras: 8,
        nivelDificultad: 'intermedio',
        contenido: ['Firestore', 'Authentication', 'Storage'],
        instructor: 'Instructor Demo',
        estado: 'activo'
      },
      {
        id: '3',
        nombre: 'Diseño con Bootstrap',
        descripcion: 'Creación de interfaces responsive con Bootstrap',
        duracionHoras: 6,
        nivelDificultad: 'principiante',
        contenido: ['Grid System', 'Componentes', 'Utilidades'],
        instructor: 'Diseñador UI',
        estado: 'inactivo'
      }
    ];
    this.filteredModulos = [...this.modulos];
    this.calcularEstadisticas();
    this.actualizarFiltroLabel();
    this.loading = false;
  }

  getUniqueInstructors(): string[] {
    const instructors = this.modulos.map(m => m.instructor);
    return [...new Set(instructors)];
  }

  buscarModulos(): void {
    if (!this.searchTerm.trim()) {
      this.aplicarFiltro();
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredModulos = this.modulos.filter(modulo =>
      modulo.nombre.toLowerCase().includes(term) ||
      modulo.descripcion.toLowerCase().includes(term) ||
      modulo.instructor.toLowerCase().includes(term)
    );
  }

  aplicarFiltro(): void {
    if (this.currentFilter === 'todos') {
      this.filteredModulos = [...this.modulos];
      return;
    }

    this.filteredModulos = this.modulos.filter(modulo => {
      if (['activo', 'inactivo'].includes(this.currentFilter)) {
        return modulo.estado === this.currentFilter;
      }
      if (['principiante', 'intermedio', 'avanzado'].includes(this.currentFilter)) {
        return modulo.nivelDificultad === this.currentFilter;
      }
      return true;
    });
  }

  cambiarFiltro(filter: string): void {
    this.currentFilter = filter;
    this.aplicarFiltro();
    this.actualizarFiltroLabel();
  }

  actualizarFiltroLabel(): void {
    const filter = this.filters.find(f => f.value === this.currentFilter);
    this.currentFilterLabel = filter ? filter.label : 'Filtrar';
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.aplicarFiltro();
  }

  editarModulo(id: string): void {
    this.router.navigate(['/modulos/editar', id]);
  }

  eliminarModulo(id: string): void {
    if (confirm('¿Estás seguro de eliminar este módulo? Esta acción no se puede deshacer.')) {
      this.moduloService.eliminarModulo(id)
        .then(() => {
          this.cargarModulos();
          alert('Módulo eliminado exitosamente');
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar el módulo');
        });
    }
  }

  verDetalles(modulo: Modulo): void {
    // Podrías implementar un modal o página de detalles
    alert(`Detalles de: ${modulo.nombre}\n\n${modulo.descripcion}`);
  }

  getBadgeClass(estado: string): string {
    switch(estado) {
      case 'activo': return 'badge-success';
      case 'inactivo': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getNivelClass(nivel: string): string {
    switch(nivel) {
      case 'principiante': return 'badge-beginner';
      case 'intermedio': return 'badge-intermediate';
      case 'avanzado': return 'badge-advanced';
      default: return 'badge-secondary';
    }
  }

  getNivelIcon(nivel: string): string {
    switch(nivel) {
      case 'principiante': return 'fas fa-star';
      case 'intermedio': return 'fas fa-star-half-alt';
      case 'avanzado': return 'fas fa-star';
      default: return 'fas fa-question';
    }
  }

  // Método para el evento input
  onSearchInput(): void {
    this.buscarModulos();
  }
}
