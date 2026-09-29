import { Injectable } from '@angular/core';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  data: TipoHabitacion[] = [
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
    return [...this.data];
  }

  obtenerPorId(id: number): TipoHabitacion | undefined {
    return this.data.find((tipoHabitacion) => tipoHabitacion.id === id);
  }

  obtenerPorPersonas(personas: number): TipoHabitacion[] {
    return this.data.filter((tipoHabitacion) => tipoHabitacion.capacidadPersonas >= personas);
  }
}
