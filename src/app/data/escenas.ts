// Escenas del recorrido 360 del hotel. Datos quemados: no hay backend en el Sprint 7.
// Las imágenes viven en public/images. Los hotspots (x, y) están en porcentaje de la imagen.
// Los puntos de interés (puntos) llevan una posición 0..100 de la vista: 0 es el borde izquierdo de la imagen.

export interface Hotspot {
  destino: string; // id de otra escena
  etiqueta: string;
  x: number;
  y: number;
}

// Punto de interés dentro de una habitación: al pulsarlo, la mirada gira hacia ese objeto.
export interface PuntoInteres {
  etiqueta: string;
  posicion: number; // 0..100, posición de la vista para centrar el objeto
}

export interface Escena {
  id: string;
  titulo: string;
  imagen: string;
  hotspots: Hotspot[];
  puntos?: PuntoInteres[];
}

export const ESCENAS: Escena[] = [
  {
    id: 'fachada',
    titulo: 'Fachada y piscina',
    imagen: '/images/mapa-hotel.jpg',
    hotspots: [
      { destino: 'habitacion-blender', etiqueta: 'Habitación modelada', x: 60, y: 60 },
      { destino: 'estandar', etiqueta: 'Habitación Estándar', x: 70, y: 60 },
      { destino: 'vip', etiqueta: 'Suite VIP', x: 85, y: 35 },
    ],
  },
  {
    id: 'habitacion-blender',
    titulo: 'Habitación modelada (Blender)',
    imagen: '/images/habitacion-blender-360.png',
    hotspots: [
      { destino: 'fachada', etiqueta: 'Volver a la fachada', x: 10, y: 50 },
      { destino: 'estandar', etiqueta: 'Habitación Estándar', x: 80, y: 50 },
    ],
  },
  {
    id: 'estandar',
    titulo: 'Habitación Estándar',
    imagen: '/images/habitacion-estandar-360.png',
    hotspots: [
      { destino: 'superior', etiqueta: 'Superior', x: 80, y: 50 },
      { destino: 'fachada', etiqueta: 'Volver a la fachada', x: 10, y: 50 },
    ],
    puntos: [
      { etiqueta: 'Cama', posicion: 92 },
      { etiqueta: 'Ventana', posicion: 17 },
      { etiqueta: 'Escritorio', posicion: 57 },
    ],
  },
  {
    id: 'superior',
    titulo: 'Habitación Superior',
    imagen: '/images/habitacion-superior-360.png',
    hotspots: [
      { destino: 'ejecutiva', etiqueta: 'Ejecutiva', x: 80, y: 50 },
      { destino: 'estandar', etiqueta: 'Estándar', x: 10, y: 50 },
    ],
    puntos: [
      { etiqueta: 'Cama', posicion: 91 },
      { etiqueta: 'Ventana', posicion: 17 },
      { etiqueta: 'Sillón', posicion: 33 },
      { etiqueta: 'Escritorio', posicion: 49 },
    ],
  },
  {
    id: 'ejecutiva',
    titulo: 'Habitación Ejecutiva',
    imagen: '/images/habitacion-ejecutiva-360.png',
    hotspots: [
      { destino: 'suite', etiqueta: 'Suite', x: 80, y: 50 },
      { destino: 'superior', etiqueta: 'Superior', x: 10, y: 50 },
    ],
    puntos: [
      { etiqueta: 'Cama', posicion: 91 },
      { etiqueta: 'Ventana', posicion: 17 },
      { etiqueta: 'Escritorio', posicion: 49 },
    ],
  },
  {
    id: 'suite',
    titulo: 'Suite',
    imagen: '/images/habitacion-suite-360.png',
    hotspots: [
      { destino: 'vip', etiqueta: 'Suite VIP', x: 80, y: 50 },
      { destino: 'ejecutiva', etiqueta: 'Ejecutiva', x: 10, y: 50 },
    ],
    puntos: [
      { etiqueta: 'Cama', posicion: 92 },
      { etiqueta: 'Ventana', posicion: 17 },
      { etiqueta: 'Sala', posicion: 41 },
      { etiqueta: 'Puerta', posicion: 56 },
    ],
  },
  {
    id: 'vip',
    titulo: 'Suite VIP',
    imagen: '/images/habitacion-vip-360.png',
    hotspots: [
      { destino: 'fachada', etiqueta: 'Volver a la fachada', x: 50, y: 80 },
      { destino: 'suite', etiqueta: 'Suite', x: 10, y: 50 },
    ],
    puntos: [
      { etiqueta: 'Cama', posicion: 92 },
      { etiqueta: 'Ventana', posicion: 17 },
      { etiqueta: 'Sala', posicion: 42 },
      { etiqueta: 'Barra', posicion: 36 },
    ],
  },
];

export function escenaPorId(id: string): Escena | undefined {
  return ESCENAS.find((e) => e.id === id);
}

// ponytail: comprobación mínima de que todos los destinos existen; falla si hay un enlace roto.
export function validarEscenas(): void {
  for (const escena of ESCENAS) {
    for (const h of escena.hotspots) {
      if (!escenaPorId(h.destino)) {
        throw new Error(`Hotspot roto: ${escena.id} -> ${h.destino}`);
      }
    }
  }
}
