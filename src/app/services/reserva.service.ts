import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private reservaArray: Reserva[] = [
    {
      id: 1,
      numeroReserva: 'MHC-2025-001',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-06-04',
      cantidadPersonas: 2,
      estado: 'ACTIVA',
      precioNoche: 280000,
      total: 840000,
      cliente: {
        id: 1,
        nombre: 'Úrsula',
        apellido: 'Iguarán',
        cedula: '101',
        telefono: '300101',
        correo: 'ursula@macondo.com',
      },
      habitacion: {
        id: 2,
        numero: '102',
        nombre: 'Habitación 102',
        estado: 'DISPONIBLE',
        capacidad: 2,
        precio: 280000,
        etiqueta: 'ACOGEDORA',
        piso: 1,
        tipoHabitacion: {
          id: 1,
          nombre: 'Castaño Fundacional',
          descripcion:
            'Refugio íntimo con vista al gran patio de Macondo, cama queen y brisa fresca.',
          imagen: '/images/HabitacionNormal.avif',
          precioNoche: 280000,
          capacidadPersonas: 2,
        },
      },
    },
    {
      id: 2,
      numeroReserva: 'MHC-2025-002',
      fechaInicio: '2025-07-10',
      fechaFin: '2025-07-13',
      cantidadPersonas: 2,
      estado: 'CONFIRMADA',
      precioNoche: 450000,
      total: 1350000,
      cliente: {
        id: 2,
        nombre: 'José Arcadio',
        apellido: 'Buendía',
        cedula: '102',
        telefono: '300102',
        correo: 'josearcadio@macondo.com',
      },
      habitacion: {
        id: 12,
        numero: '202',
        nombre: 'Habitación 202',
        estado: 'DISPONIBLE',
        capacidad: 3,
        precio: 450000,
        etiqueta: 'POPULAR',
        piso: 2,
        tipoHabitacion: {
          id: 2,
          nombre: 'Orfebrería Buendía',
          descripcion:
            'Espacio distinguido con detalles artesanales en oro, balcón y sala de lectura.',
          imagen: '/images/HabitacionExecutive.avif',
          precioNoche: 450000,
          capacidadPersonas: 3,
        },
      },
    },
    {
      id: 3,
      numeroReserva: 'MHC-2024-089',
      fechaInicio: '2024-12-10',
      fechaFin: '2024-12-13',
      cantidadPersonas: 1,
      estado: 'FINALIZADA',
      precioNoche: 280000,
      total: 840000,
      cliente: {
        id: 3,
        nombre: 'Aureliano',
        apellido: 'Buendía',
        cedula: '103',
        telefono: '300103',
        correo: 'aureliano@macondo.com',
      },
      habitacion: {
        id: 22,
        numero: '302',
        nombre: 'Habitación 302',
        estado: 'DISPONIBLE',
        capacidad: 4,
        precio: 650000,
        etiqueta: 'EXCLUSIVA',
        piso: 3,
        tipoHabitacion: {
          id: 3,
          nombre: 'Mariposas Amarillas',
          descripcion:
            'Suite boutique luminosa decorada con motivos botánicos, cama king size y terraza caribeña.',
          imagen: '/images/HabitacionVIP.avif',
          precioNoche: 650000,
          capacidadPersonas: 4,
        },
      },
    },
  ];

  obtenerTodas(): Reserva[] {
    return this.reservaArray;
  }

  obtenerPorHabitacion(habitacion: Habitacion): Reserva[] {
    return this.reservaArray.filter((reserva) => reserva.habitacion?.id === habitacion.id);
  }

  // Portal del cliente: simulan peticiones HTTP con of()

  // Filtra reservas por clienteId.
  buscarPorCliente(clienteId: number): Observable<Reserva[]> {
    const reservas = this.reservaArray.filter((reserva) => reserva.cliente?.id === clienteId);
    return of(reservas.map((r) => ({ ...r })));
  }

  // Cancela una reserva estableciendo estado 'CANCELADA'.
  cancelarReserva(id: number): Observable<Reserva | undefined> {
    const indice = this.reservaArray.findIndex((r) => r.id === id);

    if (indice === -1) {
      return of(undefined);
    }

    this.reservaArray[indice] = { ...this.reservaArray[indice], estado: 'CANCELADA' };
    return of({ ...this.reservaArray[indice] });
  }
}
