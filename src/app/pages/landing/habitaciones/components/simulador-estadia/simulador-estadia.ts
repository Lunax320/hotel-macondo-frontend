import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';

// Simulador de estadía: el visitante elige noches y personas y ve el precio de cada tipo.
@Component({
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  selector: 'app-simulador-estadia',
  templateUrl: './simulador-estadia.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class SimuladorEstadia {
  tipos = input<TipoHabitacion[]>([]);
  // Cliente con sesión iniciada; sin él, el botón de reservar lleva al login.
  clienteId = input<number | null>(null);

  // Valores del simulador con validación de rango.
  formulario = new FormGroup({
    noches: new FormControl(3, { nonNullable: true }),
    personas: new FormControl(2, { nonNullable: true }),
  });

  // Tipos que caben en el número de personas elegido, con su precio total por las noches.
  get opciones(): { tipo: TipoHabitacion; total: number }[] {
    const { noches, personas } = this.formulario.getRawValue();
    return this.tipos()
      .filter((tipo) => tipo.capacidadPersonas >= personas)
      .map((tipo) => ({ tipo, total: tipo.precioNoche * noches }));
  }

  // Ruta de reserva: con sesión, la nueva reserva con el tipo elegido; sin sesión, el login.
  rutaReserva(tipoId: number | undefined): { ruta: string[]; query: { tipoId?: number } } {
    const cliente = this.clienteId();
    return cliente !== null
      ? { ruta: ['/cliente', String(cliente), 'reservas', 'nueva'], query: { tipoId } }
      : { ruta: ['/login'], query: { tipoId } };
  }
}
