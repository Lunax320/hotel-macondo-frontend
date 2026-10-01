import { inject, Injectable } from '@angular/core';
import { Habitacion } from '../models/habitacion.model';
import { TipoHabitacion } from '../models/tipo-habitacion.model';
import { TipoHabitacionService } from './tipo-habitacion.service';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private tipoHabitacionService = inject(TipoHabitacionService);

  private habitacionArray: Habitacion[] = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const piso = Math.floor(i / 10) + 1;
    const hab = (i % 10) + 1;
    const numero = `${piso}${hab < 10 ? '0' + hab : hab}`;
    const tipoHabitacionId = piso;
    const tipoHabitacion = this.tipoHabitacionService.obtenerPorId(tipoHabitacionId);

    if (!tipoHabitacion) {
      throw new Error(`No existe el tipo de habitación ${tipoHabitacionId}.`);
    }

    const etiquetas = ['ACOGEDORA', 'POPULAR', 'EXCLUSIVA', 'HISTÓRICA', 'ÚNICA'];

    return {
      id,
      numero,
      nombre: `Habitación ${numero}`,
      estado: 'DISPONIBLE',
      capacidad: tipoHabitacion.capacidadPersonas,
      precio: tipoHabitacion.precioNoche,
      etiqueta: etiquetas[piso - 1],
      piso,
      tipoHabitacionId,
      tipoHabitacion,
    };
  });

  obtenerTodas(): Habitacion[] {
    return this.habitacionArray.map((habitacion) => this.copiarHabitacion(habitacion));
  }

  obtenerPorId(id: number): Habitacion | undefined {
    const habitacion = this.habitacionArray.find((item) => item.id === id);
    return habitacion ? this.copiarHabitacion(habitacion) : undefined;
  }

  hayDisponibilidadPorTipo(tipoHabitacionId: number): boolean {
    return this.habitacionArray.some(
      (habitacion) =>
        habitacion.tipoHabitacionId === tipoHabitacionId && habitacion.estado === 'DISPONIBLE',
    );
  }

  agregarHabitacion(habitacion: Habitacion): Habitacion {
    const nuevaHabitacion = this.prepararHabitacion(habitacion);
    nuevaHabitacion.id = this.obtenerSiguienteId();
    this.habitacionArray.push(nuevaHabitacion);
    return this.copiarHabitacion(nuevaHabitacion);
  }

  actualizarHabitacion(id: number, habitacion: Habitacion): Habitacion {
    const indice = this.habitacionArray.findIndex((item) => item.id === id);

    if (indice === -1) {
      throw new Error(`No se encontró la habitación con id ${id}.`);
    }

    const habitacionActualizada = this.prepararHabitacion(habitacion, id);
    habitacionActualizada.id = id;
    this.habitacionArray[indice] = habitacionActualizada;
    return this.copiarHabitacion(habitacionActualizada);
  }

  cambiarEstado(id: number): Habitacion | undefined {
    const habitacion = this.habitacionArray.find((item) => item.id === id);

    if (!habitacion) {
      return undefined;
    }

    habitacion.estado = habitacion.estado === 'DISPONIBLE' ? 'NO_DISPONIBLE' : 'DISPONIBLE';
    return this.copiarHabitacion(habitacion);
  }

  eliminarHabitacion(id: number): boolean {
    const cantidadAnterior = this.habitacionArray.length;
    this.habitacionArray = this.habitacionArray.filter((habitacion) => habitacion.id !== id);
    return this.habitacionArray.length < cantidadAnterior;
  }

  existeHabitacionConTipo(tipoHabitacionId: number): boolean {
    return this.habitacionArray.some(
      (habitacion) => habitacion.tipoHabitacionId === tipoHabitacionId,
    );
  }

  actualizarHabitacionesPorTipo(tipoHabitacion: TipoHabitacion): void {
    if (tipoHabitacion.id === undefined) {
      return;
    }

    this.habitacionArray
      .filter((habitacion) => habitacion.tipoHabitacionId === tipoHabitacion.id)
      .forEach((habitacion) => {
        habitacion.capacidad = tipoHabitacion.capacidadPersonas;
        habitacion.precio = tipoHabitacion.precioNoche;
        habitacion.tipoHabitacion = { ...tipoHabitacion };
      });
  }

  private prepararHabitacion(habitacion: Habitacion, idActual?: number): Habitacion {
    const tipoHabitacion = this.tipoHabitacionService.obtenerPorId(habitacion.tipoHabitacionId);
    const nombre = habitacion.nombre.trim();
    const numero = habitacion.numero.trim();
    const etiqueta = habitacion.etiqueta?.trim();

    if (!tipoHabitacion) {
      throw new Error('El tipo de habitación no existe.');
    }

    if (nombre === '' || nombre.toLocaleLowerCase() === tipoHabitacion.nombre.toLocaleLowerCase()) {
      throw new Error('El nombre de la habitación es inválido.');
    }

    if (numero === '') {
      throw new Error('El número de la habitación es obligatorio.');
    }

    const numeroRepetido = this.habitacionArray.some(
      (item) =>
        item.numero.toLocaleLowerCase() === numero.toLocaleLowerCase() && item.id !== idActual,
    );

    if (numeroRepetido) {
      throw new Error(`Ya existe una habitación con el número ${numero}.`);
    }

    if (habitacion.piso === undefined || habitacion.piso < 1) {
      throw new Error('El piso debe ser mayor o igual a 1.');
    }

    if (habitacion.estado !== 'DISPONIBLE' && habitacion.estado !== 'NO_DISPONIBLE') {
      throw new Error('El estado de la habitación es inválido.');
    }

    return {
      ...habitacion,
      numero,
      nombre,
      etiqueta,
      capacidad: tipoHabitacion.capacidadPersonas,
      precio: tipoHabitacion.precioNoche,
      tipoHabitacion: { ...tipoHabitacion },
    };
  }

  private obtenerSiguienteId(): number {
    const ids = this.habitacionArray
      .map((habitacion) => habitacion.id)
      .filter((id): id is number => id !== undefined);

    return Math.max(0, ...ids) + 1;
  }

  private copiarHabitacion(habitacion: Habitacion): Habitacion {
    return {
      ...habitacion,
      tipoHabitacion: habitacion.tipoHabitacion ? { ...habitacion.tipoHabitacion } : undefined,
    };
  }
}
