import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../services/toast.service';
import { ComentarioService } from '../../../../../services/comentario.service';

// Publica un comentario de huésped por su número. El backend aún no lista los pendientes.
@Component({
  imports: [FormsModule],
  selector: 'app-publicar-comentario',
  templateUrl: './publicar-comentario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PublicarComentario {
  private comentarioService = inject(ComentarioService);
  private toast = inject(ToastService);

  comentarioId: number | null = null;
  // Solo muestra el aviso de campo después de intentar publicar.
  intentado = false;

  publicar(): void {
    this.intentado = true;
    if (this.comentarioId === null || !Number.isInteger(this.comentarioId) || this.comentarioId < 1) {
      return;
    }
    const id = this.comentarioId;
    this.comentarioService.publicar(id).subscribe({
      next: () =>
        this.toast.mostrar(`Comentario ${id} publicado. Ya aparece en la portada.`),
      error: (err) =>
        this.toast.mostrar(err.error?.mensaje ?? 'No se pudo publicar el comentario.', 'error'),
    });
  }
}
