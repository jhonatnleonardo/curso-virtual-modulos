import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuloService, Modulo } from '../../core/services/modulo.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-modulo-form',
  templateUrl: './modulo-form.component.html',
  styleUrls: ['./modulo-form.component.scss'],
  standalone: false
})
export class ModuloFormComponent implements OnInit {
  moduloForm: FormGroup;
  isEditMode = false;
  moduloId: string | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';

  nivelesDificultad = [
    { value: 'principiante', label: 'Principiante', color: 'success' },
    { value: 'intermedio', label: 'Intermedio', color: 'warning' },
    { value: 'avanzado', label: 'Avanzado', color: 'danger' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private moduloService: ModuloService,
    private authService: AuthService
  ) {
    this.moduloForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      duracionHoras: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      nivelDificultad: ['principiante', Validators.required],
      contenido: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      instructor: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.verificarAutenticacion();
    this.cargarModuloSiEsEdicion();
  }

  verificarAutenticacion(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  cargarModuloSiEsEdicion(): void {
    this.moduloId = this.route.snapshot.paramMap.get('id');

    if (this.moduloId) {
      this.isEditMode = true;
      this.loading = true;

      this.moduloService.getModuloById(this.moduloId).subscribe({
        next: (modulo) => {
          this.cargarFormulario(modulo);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar módulo:', error);
          this.errorMessage = 'Error al cargar el módulo';
          this.loading = false;
        }
      });
    }
  }

  cargarFormulario(modulo: Modulo): void {
    // Limpiar array de contenido
    while (this.contenido.length !== 0) {
      this.contenido.removeAt(0);
    }

    // Agregar contenidos del módulo
    if (modulo.contenido && modulo.contenido.length > 0) {
      modulo.contenido.forEach(item => {
        this.contenido.push(this.fb.control(item, Validators.required));
      });
    } else {
      this.contenido.push(this.fb.control('', Validators.required));
    }

    // Cargar resto de datos
    this.moduloForm.patchValue({
      nombre: modulo.nombre,
      descripcion: modulo.descripcion,
      duracionHoras: modulo.duracionHoras,
      nivelDificultad: modulo.nivelDificultad,
      instructor: modulo.instructor,
      estado: modulo.estado
    });
  }

  get contenido(): FormArray {
    return this.moduloForm.get('contenido') as FormArray;
  }

  agregarContenido(): void {
    this.contenido.push(this.fb.control('', Validators.required));
  }

  eliminarContenido(index: number): void {
    if (this.contenido.length > 1) {
      this.contenido.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.moduloForm.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const moduloData: Modulo = {
      ...this.moduloForm.value,
      contenido: this.contenido.value.filter((item: string) => item.trim() !== '')
    };

    if (this.isEditMode && this.moduloId) {
      this.moduloService.actualizarModulo(this.moduloId, moduloData)
        .then(() => {
          this.mostrarMensajeExito('Módulo actualizado exitosamente');
          this.router.navigate(['/modulos']);
        })
        .catch(error => {
          this.errorMessage = 'Error al actualizar el módulo';
          console.error('Error:', error);
          this.submitting = false;
        });
    } else {
      this.moduloService.crearModulo(moduloData)
        .then(() => {
          this.mostrarMensajeExito('Módulo creado exitosamente');
          this.moduloForm.reset();
          this.router.navigate(['/modulos']);
        })
        .catch(error => {
          this.errorMessage = 'Error al crear el módulo';
          console.error('Error:', error);
          this.submitting = false;
        });
    }
  }

  mostrarMensajeExito(mensaje: string): void {
    alert(mensaje);
  }

  marcarCamposComoTocados(): void {
    Object.values(this.moduloForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(subControl => {
          subControl.markAsTouched();
        });
      }
    });
  }

  cancelar(): void {
    if (confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/modulos']);
    }
  }

  get f() {
    return this.moduloForm.controls;
  }
}
