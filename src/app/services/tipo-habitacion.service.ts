import { Injectable } from '@angular/core';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  private tipoHabitacionArray: TipoHabitacion[] = [
    {
      id: 1,
      nombre: 'Castaño Fundacional',
      descripcion: 'Refugio íntimo con vista al gran patio de Macondo, cama queen y brisa fresca.',
      imagen: '/images/HabitacionNormal.avif',
      precioNoche: 280000,
      capacidadPersonas: 2,
    },
    {
      id: 2,
      nombre: 'Orfebrería Buendía',
      descripcion: 'Espacio distinguido con detalles artesanales en oro, balcón y sala de lectura.',
      imagen: '/images/HabitacionExecutive.avif',
      precioNoche: 450000,
      capacidadPersonas: 3,
    },
    {
      id: 3,
      nombre: 'Mariposas Amarillas',
      descripcion:
        'Suite boutique luminosa decorada con motivos botánicos, cama king size y terraza caribeña.',
      imagen: '/images/HabitacionVIP.avif',
      precioNoche: 650000,
      capacidadPersonas: 4,
    },
    {
      id: 4,
      nombre: 'Cuarto de Melquíades',
      descripcion:
        'Suite ejecutiva con estudio privado, selección de libros clásicos y vista al río.',
      imagen: '/images/HabitacionExecutive.avif',
      precioNoche: 980000,
      capacidadPersonas: 2,
    },
    {
      id: 5,
      nombre: 'Cien Años Presidencial',
      descripcion:
        'Villa exclusiva frente al mar con piscina privada y atención personalizada 24 horas.',
      imagen: '/images/HabitacionLuxury.avif',
      precioNoche: 1900000,
      capacidadPersonas: 6,
    },
  ];

  obtenerTodos(): TipoHabitacion[] {
    return this.tipoHabitacionArray.map((tipoHabitacion) => ({ ...tipoHabitacion }));
  }

  obtenerPorId(id: number): TipoHabitacion | undefined {
    const tipoHabitacion = this.tipoHabitacionArray.find((tipo) => tipo.id === id);
    return tipoHabitacion ? { ...tipoHabitacion } : undefined;
  }

  obtenerPorPersonas(personas: number): TipoHabitacion[] {
    return this.tipoHabitacionArray
      .filter((tipoHabitacion) => tipoHabitacion.capacidadPersonas >= personas)
      .map((tipoHabitacion) => ({ ...tipoHabitacion }));
  }

  agregarTipoHabitacion(tipoHabitacion: TipoHabitacion): TipoHabitacion {
    const nuevoTipo: TipoHabitacion = {
      ...tipoHabitacion,
      id: this.obtenerSiguienteId(),
    };

    this.tipoHabitacionArray.push(nuevoTipo);
    return { ...nuevoTipo };
  }

  actualizarTipoHabitacion(id: number, tipoHabitacion: TipoHabitacion): TipoHabitacion | undefined {
    const indice = this.tipoHabitacionArray.findIndex((tipo) => tipo.id === id);

    if (indice === -1) {
      return undefined;
    }

    const tipoActualizado: TipoHabitacion = {
      ...tipoHabitacion,
      id,
    };

    this.tipoHabitacionArray[indice] = tipoActualizado;
    return { ...tipoActualizado };
  }

  eliminarTipoHabitacion(id: number): boolean {
    const cantidadAnterior = this.tipoHabitacionArray.length;
    this.tipoHabitacionArray = this.tipoHabitacionArray.filter((tipo) => tipo.id !== id);
    return this.tipoHabitacionArray.length < cantidadAnterior;
  }

  private obtenerSiguienteId(): number {
    const ids = this.tipoHabitacionArray
      .map((tipoHabitacion) => tipoHabitacion.id)
      .filter((id): id is number => id !== undefined);

    return Math.max(0, ...ids) + 1;
  }
}
