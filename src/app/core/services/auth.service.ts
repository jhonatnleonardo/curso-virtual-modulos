import { Injectable, Inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual$: Observable<User | null>;

  constructor(
    @Inject('AUTH') private auth: Auth,
    private router: Router
  ) {
    // Crear Observable manual para auth state usando onAuthStateChanged
    this.usuarioActual$ = new Observable<User | null>(observer => {
      // onAuthStateChanged devuelve una función de unsubscribe
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          observer.next(user);
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );

      // Retornar la función de cleanup
      return () => unsubscribe();
    });
  }

  // Registro de usuario
  async registrar(email: string, password: string, nombre?: string): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Si se proporcionó nombre, actualizar perfil (opcional)
      if (nombre) {
        // Aquí podrías actualizar el displayName del usuario
        // o guardar información adicional en Firestore
      }

      this.router.navigate(['/modulos']);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Inicio de sesión
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      this.router.navigate(['/modulos']);
      return userCredential.user;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // Obtener usuario actual (sincrónico)
  getUsuarioActual(): User | null {
    return this.auth.currentUser;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Obtener token ID (útil para APIs)
  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Manejo de errores de autenticación
  private getAuthErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      // Errores de registro
      'auth/email-already-in-use': 'El correo electrónico ya está registrado.',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/operation-not-allowed': 'El registro con email/contraseña no está habilitado.',
      'auth/weak-password': 'La contraseña es demasiado débil.',

      // Errores de inicio de sesión
      'auth/user-disabled': 'La cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No se encontró una cuenta con este correo.',
      'auth/wrong-password': 'La contraseña es incorrecta.',

      // Errores generales
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
      'auth/internal-error': 'Error interno del servidor.'
    };

    return errorMessages[code] || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
  }

  // Resetear contraseña (opcional)
  async resetPassword(email: string): Promise<void> {
    // Nota: Necesitas importar sendPasswordResetEmail de 'firebase/auth'
    // import { sendPasswordResetEmail } from 'firebase/auth';
    // await sendPasswordResetEmail(this.auth, email);
    console.log('Funcionalidad de reset password pendiente de implementar');
  }
}
