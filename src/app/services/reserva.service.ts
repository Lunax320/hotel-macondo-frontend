import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  data: Reserva[] = [
    {
      id: 1,
      numeroReserva: 'MHC-2025-001',
      fechaInicio: '2025-06-01',
      fechaFin: '2025-06-04',
      cantidadPersonas: 2,
      estado: 'ACTIVA',
      precioNoche: 280000,
      total: 840000,
      clienteId: 1
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
      clienteId: 2
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
      clienteId: 3
    }
  ];
}