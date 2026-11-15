import { Injectable, signal } from '@angular/core';

export interface Aviso {
  texto: string;
  tipo: 'exito' | 'error';
}

// Aviso flotante visible sin importar dónde esté el desplazamiento de la página.
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly aviso = signal<Aviso | null>(null);
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  mostrar(texto: string, tipo: 'exito' | 'error' = 'exito'): void {
    clearTimeout(this.temporizador);
    this.aviso.set({ texto, tipo });
    // Éxito 5 s; error 9 s para que alcance a leerse.
    this.temporizador = setTimeout(() => this.cerrar(), tipo === 'error' ? 9000 : 5000);
  }

  cerrar(): void {
    clearTimeout(this.temporizador);
    this.aviso.set(null);
  }
}
