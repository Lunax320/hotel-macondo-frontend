import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

// Tipos de habitacion: API REST para el admin y datos locales para las paginas publicas.
@Injectable({
  providedIn: 'root',
})
export class TipoHabitacionService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/tipo-habitacion';
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

  // Lista los tipos para el panel administrativo.
  listarTipos(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url);
  }

  // Crea un tipo de habitación.
  agregarTipo(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.url, tipo);
  }

  // Actualiza un tipo de habitación existente.
  actualizarTipo(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(this.url, tipo);
  }

  // Elimina un tipo sin habitaciones asociadas.
  eliminarTipo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
