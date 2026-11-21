// Nodos del recorrido del hotel. Generado desde blender-hotel/escenario/mapa.json.
// x, y: centro del sitio en metros sobre el plano. ancho, alto: tamaño de su forma en el minimapa.
export interface NodoHotel {
  id: string;
  titulo: string;
  corto: string; // etiqueta corta para dibujar dentro del plano
  x: number;
  y: number;
  ancho: number;
  alto: number;
  imagen: string;
  conecta: string[];
}

export const NODOS_HOTEL: NodoHotel[] = [
  { id: 'habitacion', titulo: 'Habitación', corto: 'Hab', x: 0, y: 0, ancho: 4, alto: 4, imagen: '/images/habitacion-blender-360.png', conecta: ['pasillo'] },
  { id: 'pasillo', titulo: 'Pasillo de salida', corto: '', x: 0, y: -6, ancho: 2.4, alto: 12, imagen: '/images/escenario/pasillo-360.png', conecta: ['habitacion', 'lobby', 'estandar', 'superior', 'ejecutiva', 'suite', 'vip'] },
  { id: 'lobby', titulo: 'Lobby', corto: 'Lobby', x: 0, y: -14, ancho: 6, alto: 4, imagen: '/images/escenario/lobby-360.png', conecta: ['exterior', 'pasillo', 'piscina', 'restaurante'] },
  { id: 'restaurante', titulo: 'Restaurante', corto: 'Rest.', x: -10, y: -14, ancho: 5, alto: 4, imagen: '/images/escenario/restaurante-360.png', conecta: ['lobby'] },
  { id: 'piscina', titulo: 'Piscina', corto: 'Piscina', x: 10, y: -14, ancho: 5, alto: 4, imagen: '/images/escenario/piscina-360.png', conecta: ['lobby', 'playa'] },
  { id: 'playa', titulo: 'Playa', corto: 'Playa', x: 10, y: -26, ancho: 8, alto: 6, imagen: '/images/escenario/playa-360.png', conecta: ['exterior', 'piscina'] },
  { id: 'estandar', titulo: 'Habitación Estándar', corto: 'Est.', x: -4.0, y: -4.0, ancho: 3.6, alto: 3.6, imagen: '/images/habitacion-estandar-360.png', conecta: ['pasillo'] },
  { id: 'superior', titulo: 'Habitación Superior', corto: 'Sup.', x: 4.0, y: -4.0, ancho: 3.6, alto: 3.6, imagen: '/images/habitacion-superior-360.png', conecta: ['pasillo'] },
  { id: 'ejecutiva', titulo: 'Habitación Ejecutiva', corto: 'Ejec.', x: -4.0, y: -8.0, ancho: 3.6, alto: 3.6, imagen: '/images/habitacion-ejecutiva-360.png', conecta: ['pasillo'] },
  { id: 'suite', titulo: 'Suite', corto: 'Suite', x: 4.0, y: -8.0, ancho: 3.6, alto: 3.6, imagen: '/images/habitacion-suite-360.png', conecta: ['pasillo'] },
  { id: 'vip', titulo: 'Suite VIP', corto: 'VIP', x: -4.0, y: -12.0, ancho: 3.6, alto: 3.6, imagen: '/images/habitacion-vip-360.png', conecta: ['pasillo'] },
  { id: 'exterior', titulo: 'Vista exterior del hotel', corto: 'Exterior', x: 0, y: -22, ancho: 10, alto: 4, imagen: '/images/escenario/exterior-360.png', conecta: ['lobby', 'playa'] },
];
