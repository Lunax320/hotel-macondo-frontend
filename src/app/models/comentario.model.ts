// Comentario publicado de un huésped, tal como lo devuelve GET /api/comentario/publicados.
export interface ComentarioPublico {
  id: number;
  nombre: string;
  calificacion: number;
  texto: string;
  fechaCreacion: string;
  publicado: boolean;
}

// Cuerpo de POST /api/comentario.
export interface ComentarioSolicitud {
  clienteId: number;
  reservaId: number;
  calificacion: number;
  texto: string;
}

// Comentario propio del cliente, tal como lo devuelve GET /api/comentario/cliente/{id}.
export interface ComentarioCliente {
  id: number;
  reservaId: number;
  calificacion: number;
  texto: string;
  fechaCreacion: string;
  publicado: boolean;
}
