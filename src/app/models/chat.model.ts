export type ChatActionId =
  | 'RESERVAR'
  | 'REGISTRO'
  | 'CANCELAR_RESERVA'
  | 'CHECKOUT'
  | 'PAGO_SEGURO';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  mensaje: string;
  historial: ChatMessage[];
}

export interface ChatResponse {
  respuesta: string;
  acciones?: ChatActionId[];
}
