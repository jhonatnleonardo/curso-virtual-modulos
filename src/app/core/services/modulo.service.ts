import { Injectable, Inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';

// Exportar la interfaz Modulo
export interface Modulo {
  id?: string;
  nombre: string;
  descripcion: string;
  duracionHoras: number;
  nivelDificultad: 'principiante' | 'intermedio' | 'avanzado';
  contenido: string[];
  instructor: string;
  fechaCreacion?: any;
  fechaActualizacion?: any;
  estado: 'activo' | 'inactivo';
}

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private readonly COLECCION = 'modulos';

  constructor(@Inject('FIRESTORE') private firestore: Firestore) {}

  // Obtener todos los módulos
  getModulos(): Observable<Modulo[]> {
    const modulosRef = collection(this.firestore, this.COLECCION);
    const q = query(modulosRef, orderBy('fechaCreacion', 'desc'));

    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Modulo
        }))
      )
    );
  }

  // Obtener un módulo por ID
  getModuloById(id: string): Observable<Modulo> {
    const moduloRef = doc(this.firestore, `${this.COLECCION}/${id}`);

    return from(getDoc(moduloRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Módulo no encontrado');
        }
        return {
          id: docSnap.id,
          ...docSnap.data() as Modulo
        };
      })
    );
  }

  // Crear nuevo módulo
  async crearModulo(modulo: Modulo): Promise<string> {
    const modulosRef = collection(this.firestore, this.COLECCION);

    const docRef = await addDoc(modulosRef, {
      ...modulo,
      fechaCreacion: Timestamp.now(),
      fechaActualizacion: Timestamp.now()
    });

    return docRef.id;
  }

  // Actualizar módulo
  async actualizarModulo(id: string, modulo: Partial<Modulo>): Promise<void> {
    const moduloRef = doc(this.firestore, `${this.COLECCION}/${id}`);

    await updateDoc(moduloRef, {
      ...modulo,
      fechaActualizacion: Timestamp.now()
    });
  }

  // Eliminar módulo
  async eliminarModulo(id: string): Promise<void> {
    const moduloRef = doc(this.firestore, `${this.COLECCION}/${id}`);
    await deleteDoc(moduloRef);
  }
}
