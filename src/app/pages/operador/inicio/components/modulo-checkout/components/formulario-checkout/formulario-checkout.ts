import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-formulario-checkout',
  templateUrl: './formulario-checkout.html',
})
export class FormularioCheckout {
  @Output() buscar = new EventEmitter<string>();

  habitacionId = '';

  enviar(): void {
    const id = this.habitacionId.trim();
    if (/^\d+$/.test(id)) {
      this.buscar.emit(id);
    }
  }
}
