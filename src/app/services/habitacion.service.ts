import { Injectable } from '@angular/core';
import { Habitacion } from '../models/habitacion.model';
import { TipoHabitacion } from '../models/tipo-habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
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

  private habitacionArray: Habitacion[] = Array.from({ length: 50 }, (_, i) => {
    const id = i + 1;
    const piso = Math.floor(i / 10) + 1;
    const hab = (i % 10) + 1;
    const numero = `${piso}${hab < 10 ? '0' + hab : hab}`;
    const tipoHabitacion = this.tipoHabitacionArray.find((tipo) => tipo.id === piso);

    if (!tipoHabitacion) {
      throw new Error(`No existe el tipo de habitación ${piso}.`);
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
      tipoHabitacion,
    };
  });

  obtenerTodas(): Habitacion[] {
    return this.habitacionArray;
  }

  obtenerPorId(id: number): Habitacion | undefined {
    return this.habitacionArray.find((habitacion) => habitacion.id === id);
  }

  hayDisponibilidadPorTipo(tipoHabitacion: TipoHabitacion): boolean {
    return this.habitacionArray.some(
      (habitacion) =>
        habitacion.tipoHabitacion.id === tipoHabitacion.id && habitacion.estado === 'DISPONIBLE',
    );
  }

  agregarHabitacion(habitacion: Habitacion): Habitacion {
    const nuevaHabitacion = this.prepararHabitacion(habitacion);
    nuevaHabitacion.id = this.obtenerSiguienteId();
    this.habitacionArray.push(nuevaHabitacion);
    return nuevaHabitacion;
  }

  actualizarHabitacion(id: number, habitacion: Habitacion): Habitacion {
    const indice = this.habitacionArray.findIndex((item) => item.id === id);

    if (indice === -1) {
      throw new Error(`No se encontró la habitación con id ${id}.`);
    }

    const habitacionActualizada = this.prepararHabitacion(habitacion, id);
    habitacionActualizada.id = id;
    this.habitacionArray[indice] = habitacionActualizada;
    return habitacionActualizada;
  }

  cambiarEstado(id: number): Habitacion | undefined {
    const habitacion = this.habitacionArray.find((item) => item.id === id);

    if (!habitacion) {
      return undefined;
    }

    habitacion.estado = habitacion.estado === 'DISPONIBLE' ? 'NO_DISPONIBLE' : 'DISPONIBLE';
    return habitacion;
  }

  eliminarHabitacion(id: number): boolean {
    const cantidadAnterior = this.habitacionArray.length;
    this.habitacionArray = this.habitacionArray.filter((habitacion) => habitacion.id !== id);
    return this.habitacionArray.length < cantidadAnterior;
  }

  existeHabitacionConTipo(tipoHabitacion: TipoHabitacion): boolean {
    return this.habitacionArray.some(
      (habitacion) => habitacion.tipoHabitacion.id === tipoHabitacion.id,
    );
  }

  actualizarHabitacionesPorTipo(tipoHabitacion: TipoHabitacion): void {
    if (tipoHabitacion.id === undefined) {
      return;
    }

    this.habitacionArray
      .filter((habitacion) => habitacion.tipoHabitacion.id === tipoHabitacion.id)
      .forEach((habitacion) => {
        habitacion.capacidad = tipoHabitacion.capacidadPersonas;
        habitacion.precio = tipoHabitacion.precioNoche;
        habitacion.tipoHabitacion = tipoHabitacion;
      });
  }

  private prepararHabitacion(habitacion: Habitacion, idActual?: number): Habitacion {
    const tipoHabitacion = habitacion.tipoHabitacion;
    const nombre = habitacion.nombre.trim();
    const numero = habitacion.numero.trim();
    const etiqueta = habitacion.etiqueta?.trim();

    if (tipoHabitacion.id === undefined) {
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

    habitacion.numero = numero;
    habitacion.nombre = nombre;
    habitacion.etiqueta = etiqueta;
    habitacion.capacidad = tipoHabitacion.capacidadPersonas;
    habitacion.precio = tipoHabitacion.precioNoche;
    habitacion.tipoHabitacion = tipoHabitacion;

    return habitacion;
  }

  private obtenerSiguienteId(): number {
    const ids = this.habitacionArray
      .map((habitacion) => habitacion.id)
      .filter((id): id is number => id !== undefined);

    return Math.max(0, ...ids) + 1;
  }
}
