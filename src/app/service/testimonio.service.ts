import { Injectable } from '@angular/core';
import { Testimonio } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {
  data: Testimonio[] = [
    {
      id: 1,
      texto: 'Hotel Macondo es un sueño hecho realidad. La combinación de lujo, naturaleza y la magia del Caribe colombiano me dejó sin palabras. Regresaré sin duda.',
      nombre: 'Valentina Ospina',
      ciudad: 'Bogotá, Colombia',
      estrellas: 5,
      imagen: '/images/IconoP1.avif'
    },
    {
      id: 2,
      texto: 'Nunca imaginé que un hotel pudiera transmitir tanta poesía. El restaurante es excepcional y el servicio es de otro planeta. Una experiencia completamente transformadora.',
      nombre: 'Martín Delgado',
      ciudad: 'Ciudad de México, México',
      estrellas: 5,
      imagen: '/images/IconoP2.avif'
    },
    {
      id: 3,
      texto: 'Vine buscando descanso y encontré magia pura. La suite VIP con terraza frente al mar y el spa con rituales caribeños fueron absolutamente perfectos.',
      nombre: 'Sofía Benítez',
      ciudad: 'Madrid, España',
      estrellas: 5,
      imagen: '/images/IconoP3.avif'
    },
    {
      id: 4,
      texto: 'La calidez de la atención y la arquitectura colonial te transportan en el tiempo. Cada rincón tiene un encanto inigualable.',
      nombre: 'Camilo Echeverry',
      ciudad: 'Medellín, Colombia',
      estrellas: 5,
      imagen: '/images/IconoP1.avif'
    },
    {
      id: 5,
      texto: 'La tranquilidad de la playa privada y el sabor del pescado fresco en la cena hicieron de nuestro aniversario algo inolvidable.',
      nombre: 'Lucía Fernández',
      ciudad: 'Buenos Aires, Argentina',
      estrellas: 5,
      imagen: '/images/IconoP2.avif'
    }
  ];

  obtenerTodos(): Testimonio[] {
    return [...this.data];
  }
}