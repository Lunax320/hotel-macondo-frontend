import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Reserva } from '../../../../../models/reserva.model';
import { ComentarioCliente } from '../../../../../models/comentario.model';
import { ToastService } from '../../../../../services/toast.service';
import { ComentarioService } from '../../../../../services/comentario.service';

@Component({
  selector: 'app-historial-item',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './historial-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class HistorialItem implements OnChanges {
  reserva = input.required<Reserva>();
  abierto = false;

  private comentarioService = inject(ComentarioService);
  private toast = inject(ToastService);

  clienteId = input.required<number>();
  // El padre consulta los comentarios del cliente una sola vez y pasa el de esta reserva (o null).
  comentario = input<ComentarioCliente | null>(null);
  actual: ComentarioCliente | null = null;
  editando = false;
  confirmandoBorrado = false;

  // Cada vez que el padre cambia el comentario de esta reserva, se copia al estado local.
  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios['comentario']) {
      this.actual = this.comentario();
    }
  }

  // Noches entre entrada y salida; null si las fechas no son válidas.
  get noches(): number | null {
    const r = this.reserva();
    const n = Math.round(
      (new Date(r.fechaFin).getTime() - new Date(r.fechaInicio).getTime()) / 86_400_000,
    );
    return isNaN(n) || n < 0 ? null : n;
  }

  alternar(): void {
    this.abierto = !this.abierto;
  }

  readonly estrellas = [1, 2, 3, 4, 5];
  readonly minimo = 10;
  readonly maximo = 500;

  formAbierto = false;
  enviando = false;
  calificacion = 0;
  texto = '';
  intentado = false;
  errorServidor = '';

  // Referencia al formulario, para enfocar el primer campo con error.
  @ViewChild('formulario') contenedor?: ElementRef<HTMLElement>;

  get finalizada(): boolean {
    return this.reserva().estado?.toUpperCase() === 'FINALIZADA';
  }

  get errorEstrellas(): string {
    return this.calificacion < 1 ? 'Elige de 1 a 5 estrellas.' : '';
  }

  get errorTexto(): string {
    const n = this.texto.trim().length;
    if (n < this.minimo) return `El comentario debe tener al menos ${this.minimo} caracteres.`;
    return '';
  }

  abrir(): void {
    this.calificacion = 0;
    this.texto = '';
    this.intentado = false;
    this.formAbierto = true;
  }

  // Abre el formulario con los valores del comentario existente.
  editar(): void {
    if (!this.actual) return;
    this.calificacion = this.actual.calificacion;
    this.texto = this.actual.texto;
    this.editando = true;
    this.formAbierto = true;
  }

  pedirBorrado(): void {
    this.confirmandoBorrado = true;
    this.errorServidor = '';
  }

  cancelarBorrado(): void {
    this.confirmandoBorrado = false;
  }

  private mensajeError(error: HttpErrorResponse, defecto: string): string {
    const r: unknown = error.error;
    return r !== null && typeof r === 'object' && 'mensaje' in r && typeof r.mensaje === 'string'
      ? r.mensaje
      : defecto;
  }

  eliminar(): void {
    if (!this.actual) return;
    this.enviando = true;
    this.comentarioService.eliminar(this.actual.id, this.clienteId()).subscribe({
      next: () => {
        this.actual = null;
        this.confirmandoBorrado = false;
        this.enviando = false;
        this.toast.mostrar('Comentario eliminado.');
      },
      error: (e: HttpErrorResponse) => {
        this.errorServidor = this.mensajeError(e, 'No fue posible eliminar el comentario. Intenta de nuevo.');
        this.confirmandoBorrado = false;
        this.enviando = false;
      },
    });
  }

  cancelar(): void {
    this.formAbierto = false;
    this.editando = false;
    this.intentado = false;
    this.errorServidor = '';
  }

  elegir(n: number): void {
    this.calificacion = n;
  }

  // Valida y envía; si algo falla enfoca el primer campo inválido.
  enviar(): void {
    this.intentado = true;
    this.errorServidor = '';
    const el = this.contenedor?.nativeElement;
    if (this.errorEstrellas) {
      el?.querySelector<HTMLElement>('[data-estrella]')?.focus();
      return;
    }
    if (this.errorTexto) {
      el?.querySelector<HTMLElement>('textarea')?.focus();
      return;
    }
    const reservaId = this.reserva().id;
    if (reservaId === undefined) return;
    this.enviando = true;
    const texto = this.texto.trim();
    const alFallar = (error: HttpErrorResponse) => {
      this.errorServidor = this.mensajeError(error, 'No fue posible enviar el comentario. Intenta de nuevo.');
      this.enviando = false;
    };
    if (this.editando && this.actual) {
      this.comentarioService
        .actualizar(this.actual.id, this.clienteId(), { calificacion: this.calificacion, texto })
        .subscribe({
          next: (c) => this.publicarYCerrar(c, 'Comentario actualizado y publicado en la portada.'),
          error: alFallar,
        });
      return;
    }
    this.comentarioService
      .crear({ clienteId: this.clienteId(), reservaId, calificacion: this.calificacion, texto })
      .subscribe({
        next: (c) =>
          this.publicarYCerrar(
            {
              id: c.id,
              reservaId,
              calificacion: this.calificacion,
              texto,
              fechaCreacion: c.fechaCreacion,
              publicado: false,
            },
            'Gracias, tu comentario ya está publicado en la portada.',
          ),
        error: alFallar,
      });
  }

  // Publica el comentario recién guardado para que aparezca en la portada sin revisión previa.
  private publicarYCerrar(comentario: ComentarioCliente, mensajeOk: string): void {
    this.comentarioService.publicar(comentario.id).subscribe({
      next: () => {
        this.actual = { ...comentario, publicado: true };
        this.enviando = false;
        this.formAbierto = false;
        this.editando = false;
        this.toast.mostrar(mensajeOk);
      },
      error: () => {
        this.actual = { ...comentario, publicado: false };
        this.enviando = false;
        this.formAbierto = false;
        this.editando = false;
        this.toast.mostrar('Tu comentario se guardó, pero no se pudo publicar. Intenta de nuevo.', 'error');
      },
    });
  }
}
