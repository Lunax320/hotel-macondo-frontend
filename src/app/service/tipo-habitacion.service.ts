import { Injectable } from '@angular/core';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
  data: TipoHabitacion[] = [
    {
      id: 1,
      nombre: 'Normal',
      descripcion: 'Refugio íntimo con vista al gran patio de Macondo, cama queen y brisa fresca.',
      imagen: '/images/HabitacionNormal.avif',
      precioNoche: 280000,
      capacidadPersonas: 2
    },
    {
      id: 2,
      nombre: 'Executive',
      descripcion: 'Espacio distinguido con detalles artesanales en oro, balcón y sala de lectura.',
      imagen: '/images/HabitacionExecutive.avif',
      precioNoche: 450000,
      capacidadPersonas: 3
    },
    {
      id: 3,
      nombre: 'VIP',
      descripcion: 'Suite boutique luminosa decorada con motivos botánicos, cama king size y terraza caribeña.',
      imagen: '/images/HabitacionVIP.avif',
      precioNoche: 650000,
      capacidadPersonas: 4
    },
    {
      id: 4,
      nombre: 'Luxury',
      descripcion: 'Villa exclusiva frente al mar con piscina privada y atención personalizada 24 horas.',
      imagen: '/images/HabitacionLuxury.avif',
      precioNoche: 1900000,
      capacidadPersonas: 6
    }
  ];

  obtenerTodos(): TipoHabitacion[] {
    return [...this.data];
  }
}