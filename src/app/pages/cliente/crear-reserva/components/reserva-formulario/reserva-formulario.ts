import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../../../models/tipo-habitacion.model';
import { ReservaCalendario } from '../reserva-calendario/reserva-calendario';

export interface ErroresReserva {
  tipo?: string;
  entrada?: string;
  salida?: string;
  personas?: string;
}

// Reglas de los campos de la reserva; las usan el formulario (para mostrarlas) y la página (para validar).
export function erroresReserva(
  v: { tipoId?: unknown; fechaEntrada?: unknown; fechaSalida?: unknown; cantidadPersonas?: unknown },
  tipos: TipoHabitacion[],
  fechaMinima: string,
): ErroresReserva {
  const e: ErroresReserva = {};
  const tipo = tipos.find((t) => t.id === Number(v.tipoId));
  const entrada = String(v.fechaEntrada ?? '');
  const salida = String(v.fechaSalida ?? '');
  const texto = String(v.cantidadPersonas ?? '').trim();
  const cantidad = Number(texto);
  if (!tipo) e.tipo = 'Selecciona un tipo de habitación.';
  if (!entrada) e.entrada = 'Elige la fecha de entrada.';
  else if (entrada < fechaMinima) e.entrada = 'La entrada no puede estar en el pasado.';
  if (!salida) e.salida = 'Elige la fecha de salida.';
  else if (entrada && salida <= entrada) e.salida = 'La salida debe ser posterior a la entrada.';
  if (texto === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    e.personas = 'Indica una cantidad entera de personas mayor que cero.';
  } else if (tipo && cantidad > tipo.capacidadPersonas) {
    e.personas = `Este tipo de habitación admite hasta ${tipo.capacidadPersonas} ${tipo.capacidadPersonas === 1 ? 'persona' : 'personas'}.`;
  }
  return e;
}

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, ReservaCalendario],
  selector: 'app-reserva-formulario',
  styleUrl: './reserva-formulario.scss',
  templateUrl: './reserva-formulario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservaFormulario {
  formulario = input.required<FormGroup>();
  tiposHabitacion = input.required<TipoHabitacion[]>();
  fechaMinima = input.required<string>();
  clienteId = input.required<number>();
  reservaId = input<number | undefined>(undefined);
  criteriosCambiados = output<void>();

  get errores(): ErroresReserva {
    return erroresReserva(this.formulario().value, this.tiposHabitacion(), this.fechaMinima());
  }

  mostrar(campo: string): boolean {
    return !!this.formulario().get(campo)?.touched;
  }

  // Calcula noches × precio por noche a partir de las fechas y el tipo elegidos
  get resumenEstadia(): { noches: number; personas: number; precioNoche: number; total: number } | null {
    const formulario = this.formulario();
    const entrada = formulario.get('fechaEntrada')?.value;
    const salida = formulario.get('fechaSalida')?.value;
    const tipoId = Number(formulario.get('tipoId')?.value);
    const tipo = this.tiposHabitacion().find((item) => item.id === tipoId);
    const personas = Number(formulario.get('cantidadPersonas')?.value);
    if (!entrada || !salida || !tipo || !Number.isInteger(personas) || personas < 1) {
      return null;
    }
    const noches = Math.round(
      (new Date(`${salida}T00:00:00`).getTime() - new Date(`${entrada}T00:00:00`).getTime()) /
        86_400_000,
    );
    if (noches < 1) {
      return null;
    }
    return { noches, personas, precioNoche: tipo.precioNoche, total: noches * tipo.precioNoche };
  }
}
