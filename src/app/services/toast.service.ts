import { Injectable } from '@angular/core';

export interface Aviso {
  texto: string;
  tipo: 'exito' | 'error';
}

// Aviso flotante visible sin importar dónde esté el desplazamiento de la página.
@Injectable({ providedIn: 'root' })
export class ToastService {
  // Aviso que se muestra ahora; null cuando no hay ninguno.
  aviso: Aviso | null = null;
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  mostrar(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    clearTimeout(this.temporizador);
    this.aviso = { texto, tipo };
    // Éxito 5 s; error 9 s para que alcance a leerse.
    this.temporizador = setTimeout(() => this.cerrar(), tipo === 'error' ? 9000 : 5000);
  }

  cerrar(): void {
    clearTimeout(this.temporizador);
    this.aviso = null;
  }
}
