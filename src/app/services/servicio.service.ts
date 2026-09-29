import { Injectable } from '@angular/core';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  data: Servicio[] = [
    {
      id: 1,
      nombre: 'Spa & Bienestar',
      categoria: 'Bienestar',
      duracion: '60-90 min',
      descripcion:
        'Sumérgete en una experiencia sensorial de relajación profunda con masajes terapéuticos, aromaterapia caribeña y tratamientos faciales con ingredientes de la región.',
      descripcionDetalle:
        'Nuestro spa combina técnicas milenarias de bienestar con ingredientes naturales del Caribe: aceite de coco, flores de cayena, sales del mar y hierbas aromáticas de la Sierra Nevada. Cada sesión está diseñada para despertar los sentidos y restaurar el equilibrio del cuerpo y la mente. Disfruta de masajes relajantes, tratamientos de hidroterapia, envolturas de arcilla caribeña y aromaterapia en cabinas privadas con vista al jardín tropical.',
      imagen: '/images/Spa.avif',
      destacado: true,
      precio: 120000,
      activo: true,
      horario: 'Lunes a domingo: 8:00 a.m. - 8:00 p.m.',
      incluidos: [
        'Masaje de 60 min',
        'Aromaterapia incluida',
        'Baño de vapor',
        'Infusión de hierbas',
        'Cabina privada',
        'Toallas de lujo',
      ],
      etiquetas: ['Masajes', 'Hidroterapia', 'Aromaterapia', 'Tratamientos faciales'],
    },
    {
      id: 2,
      nombre: 'Restaurante Gourmet',
      categoria: 'Gastronomía',
      duracion: 'Almuerzo & cena',
      descripcion:
        'La cocina caribeña elevada a su máxima expresión. Platos elaborados con productos locales y técnicas contemporáneas, con vista panorámica al mar.',
      descripcionDetalle:
        'Una experiencia culinaria donde los sabores del Caribe se encuentran con técnicas contemporáneas. Nuestro menú celebra los productos locales, la pesca del día y las recetas que han pasado de generación en generación.',
      imagen: '/images/Restaurante.avif',
      destacado: false,
      precio: 85000,
      activo: true,
      horario: 'Todos los días: 12:00 m. - 10:30 p.m.',
      incluidos: [
        'Menú degustación',
        'Maridaje de vinos',
        'Vista al mar',
        'Reserva garantizada',
        'Opción Vegana',
        'Menú infantil',
      ],
      etiquetas: ['Cocina caribeña', 'Maridaje', 'Cena', 'Productos locales'],
    },
    {
      id: 3,
      nombre: 'Piscina Infinity',
      categoria: 'Bienestar',
      duracion: 'Acceso diario',
      descripcion:
        'Nada hacia el horizonte infinito del Caribe desde nuestra piscina de borde abierto frente al mar.',
      descripcionDetalle:
        'Una piscina serena frente al Caribe, con camastros, bebidas frescas y atención durante todo el día.',
      imagen: '/images/Piscina.avif',
      destacado: false,
      precio: 70000,
      activo: true,
      horario: 'Lunes a domingo: 7:00 a.m. - 9:00 p.m.',
      incluidos: [
        'Camastro reservado',
        'Toallas',
        'Bebida de bienvenida',
        'Servicio junto a la piscina',
      ],
      etiquetas: ['Piscina', 'Descanso', 'Vista al mar'],
    },
    {
      id: 4,
      nombre: 'Playa Privada',
      categoria: 'Bienestar',
      duracion: 'Acceso diario',
      descripcion: 'Arena blanca, sombra natural y el Caribe a pocos pasos de tu habitación.',
      descripcionDetalle:
        'Disfruta de un sector reservado de playa con servicio personalizado, zonas de descanso y actividades tranquilas frente al mar.',
      imagen: '/images/PlayaPriv.avif',
      destacado: false,
      precio: 60000,
      activo: true,
      horario: 'Lunes a domingo: 7:00 a.m. - 6:00 p.m.',
      incluidos: ['Sombrilla', 'Camastro', 'Toalla', 'Bebida de bienvenida'],
      etiquetas: ['Playa', 'Descanso', 'Caribe'],
    },
    {
      id: 5,
      nombre: 'Tours Guiados',
      categoria: 'Aventura',
      duracion: 'Medio día / Día completo',
      descripcion:
        'Descubre los rincones más mágicos de la costa caribeña con nuestros guías expertos. Cartagena histórica, islas del Rosario, manglares y más.',
      descripcionDetalle:
        'Recorre Cartagena y sus alrededores con anfitriones locales que conocen cada historia, sabor y paisaje de la región.',
      imagen: '/images/Guiado.avif',
      destacado: false,
      precio: 95000,
      activo: true,
      horario: 'Salidas programadas todos los días.',
      incluidos: ['Guía bilingüe', 'Transporte incluido', 'Snacks y agua', 'Seguro de viaje'],
      etiquetas: ['Cartagena', 'Islas', 'Manglares', 'Historia'],
    },
    {
      id: 6,
      nombre: 'Eventos Especiales',
      categoria: 'Exclusivo',
      duracion: 'A medida',
      descripcion:
        'Celebra los momentos más importantes de tu vida en el escenario perfecto. Bodas, aniversarios, reuniones corporativas con decoración y catering de lujo.',
      descripcionDetalle:
        'Creamos celebraciones a medida frente al mar, desde encuentros privados hasta bodas y eventos corporativos completos.',
      imagen: '/images/Eventos.avif',
      destacado: false,
      precio: 3500000,
      activo: true,
      horario: 'Programación personalizada.',
      incluidos: [
        'Coordinador de eventos',
        'Decoración temática',
        'Catering gourmet',
        'Fotografía profesional',
      ],
      etiquetas: ['Bodas', 'Celebraciones', 'Eventos corporativos'],
    },
  ];

  obtenerTodos(): Servicio[] {
    return [...this.data];
  }

  obtenerCatalogoActivo(): Servicio[] {
    return this.data.filter((servicio) => servicio.activo);
  }

  obtenerCategoriasDisponibles(): string[] {
    return [...new Set(this.obtenerCatalogoActivo().map((servicio) => servicio.categoria))];
  }

  obtenerPorId(id: number): Servicio | undefined {
    return this.data.find((servicio) => servicio.id === id && servicio.activo);
  }

  obtenerRelacionados(servicioActualId: number, limite: number): Servicio[] {
    if (limite <= 0) {
      return [];
    }

    return this.obtenerCatalogoActivo()
      .filter((servicio) => servicio.id !== servicioActualId)
      .slice(0, limite);
  }
}
