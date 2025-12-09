export interface Modulo {
  id?: string;
  nombre: string;
  descripcion: string;
  duracionHoras: number;
  nivelDificultad: 'principiante' | 'intermedio' | 'avanzado';
  contenido: string[];
  instructor: string;
  fechaCreacion?: any;
  estado: 'activo' | 'inactivo';
}
