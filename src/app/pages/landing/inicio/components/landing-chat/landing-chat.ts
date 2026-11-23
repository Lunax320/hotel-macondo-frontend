import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../../../../services/chat.service';
import { ChatActionId, ChatMessage } from '../../../../../models/chat.model';
import { UsuarioService } from '../../../../../services/usuario.service';

interface MensajeChat {
  autor: 'asistente' | 'usuario';
  texto: string;
  acciones: AccionChat[];
}

interface AccionChat {
  id: ChatActionId;
  etiqueta: string;
  ruta: (string | number)[];
}

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-landing-chat',
  templateUrl: './landing-chat.html',
  styleUrl: './landing-chat.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LandingChat {
  private readonly chatService = inject(ChatService);
  private readonly usuarioService = inject(UsuarioService);

  abierto = false;
  mensaje = '';
  enviando = false;
  mensajes: MensajeChat[] = [
    {
      autor: 'asistente',
      texto: '¡Hola! Bienvenido a Hotel Macondo. ¿En qué puedo ayudarte?',
      acciones: [],
    },
  ];
  private historial: ChatMessage[] = [];

  enviarMensaje(): void {
    const texto = this.mensaje.trim();
    if (!texto || this.enviando) {
      return;
    }

    this.mensaje = '';
    this.mensajes.push({ autor: 'usuario', texto, acciones: [] });
    this.enviando = true;

    this.chatService.conversar(texto, this.historial.slice(-10)).subscribe({
      next: (respuesta) => {
        this.mensajes.push({
          autor: 'asistente',
          texto: respuesta.respuesta,
          acciones: this.resolverAcciones(respuesta.acciones ?? []),
        });
        this.historial.push(
          { role: 'user', content: texto },
          { role: 'assistant', content: respuesta.respuesta },
        );
        this.enviando = false;
      },
      error: (error: HttpErrorResponse) => {
        const detalle = error.error?.mensaje;
        this.mensajes.push({
          autor: 'asistente',
          texto:
            typeof detalle === 'string'
              ? detalle
              : 'No fue posible conectar con el asistente. Inténtalo nuevamente en un momento.',
          acciones: [],
        });
        this.enviando = false;
      },
    });
  }

  private resolverAcciones(acciones: ChatActionId[]): AccionChat[] {
    const sesion = this.usuarioService.obtenerSesion();
    const esPersonal = sesion?.roles.some(
      (rol) => rol === 'ADMINISTRADOR' || rol === 'OPERADOR',
    ) ?? false;

    return acciones.map((id) => {
      switch (id) {
        case 'RESERVAR':
          return { id, etiqueta: 'Ver habitaciones', ruta: ['/habitaciones'] };
        case 'REGISTRO':
          return { id, etiqueta: 'Crear cuenta', ruta: ['/registro'] };
        case 'CANCELAR_RESERVA':
          if (esPersonal) {
            return { id, etiqueta: 'Ver reservas', ruta: ['/operador/reservas'] };
          }
          if (sesion?.clienteId !== undefined) {
            return {
              id,
              etiqueta: 'Gestionar mis reservas',
              ruta: ['/cliente', sesion.clienteId, 'reservas'],
            };
          }
          return { id, etiqueta: 'Iniciar sesión para cancelar', ruta: ['/login'] };
        case 'CHECKOUT':
          if (esPersonal) {
            return { id, etiqueta: 'Abrir checkout', ruta: ['/operador/checkout'] };
          }
          if (sesion?.clienteId !== undefined) {
            return {
              id,
              etiqueta: 'Ver mis reservas y pagos',
              ruta: ['/cliente', sesion.clienteId, 'reservas'],
            };
          }
          return { id, etiqueta: 'Acceder a mis reservas', ruta: ['/login'] };
        case 'PAGO_SEGURO':
          if (esPersonal) {
            return { id, etiqueta: 'Abrir checkout', ruta: ['/operador/checkout'] };
          }
          if (sesion?.clienteId !== undefined) {
            return {
              id,
              etiqueta: 'Ver mis reservas y pagos',
              ruta: ['/cliente', sesion.clienteId, 'reservas'],
            };
          }
          return { id, etiqueta: 'Iniciar sesión para ver pagos', ruta: ['/login'] };
      }
    });
  }
}
