import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

export const autorizacionInterceptor: HttpInterceptorFn = (request, next) => {
  // El token solo se envía al backend de Macondo, nunca a otros servidores.
  if (!request.url.startsWith('http://localhost:8080/')) return next(request);

  const path = new URL(request.url).pathname;
  if (path === '/api/auth/login' || path === '/api/cliente/registro') return next(request);

  const usuarioService = inject(UsuarioService);
  const token = usuarioService.obtenerToken();
  const autorizada = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(autorizada).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Una respuesta atrasada no debe borrar un login más reciente.
        const tokenActual = usuarioService.obtenerToken();
        if (!tokenActual || tokenActual === token) usuarioService.cerrarSesion();
      }
      return throwError(() => error);
    }),
  );
};
