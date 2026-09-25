import { Injectable } from '@angular/core';
import { Habitacion } from '../models/habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  data: Habitacion[] = [
    // 50 habitaciones disponibles generadas para la estructura del hotel
    ...Array.from({ length: 50 }, (_, i) => {
      const id = i + 1;
      const piso = Math.floor(i / 10) + 1;
      const hab = (i % 10) + 1;
      const numero = `${piso}${hab < 10 ? '0' + hab : hab}`;
      const tipos = [
        { id: 1, precio: 280000, capacidad: 2, imagen: '/images/HabitacionNormal.avif', etiqueta: 'ACOGEDORA' },
        { id: 2, precio: 450000, capacidad: 3, imagen: '/images/HabitacionExecutive.avif', etiqueta: 'POPULAR' },
        { id: 3, precio: 650000, capacidad: 4, imagen: '/images/HabitacionVIP.avif', etiqueta: 'EXCLUSIVA' },
        { id: 4, precio: 980000, capacidad: 2, imagen: '/images/HabitacionExecutive.avif', etiqueta: 'HISTÓRICA' },
        { id: 5, precio: 1900000, capacidad: 6, imagen: '/images/HabitacionLuxury.avif', etiqueta: 'ÚNICA' }
      ];
      const tipo = tipos[piso - 1];
      return {
        id: id,
        numero: numero,
        nombre: `Habitación ${numero}`,
        estado: 'DISPONIBLE',
        capacidad: tipo.capacidad,
        precio: tipo.precio,
        etiqueta: tipo.etiqueta,
        imagen: tipo.imagen,
        piso: piso,
        tipoHabitacionId: tipo.id
      };
    })
  ];
}