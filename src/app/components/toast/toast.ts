import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

// Aviso flotante centrado arriba: confirma acciones sin depender del desplazamiento.
@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Toast {
  readonly toast = inject(ToastService);
}
