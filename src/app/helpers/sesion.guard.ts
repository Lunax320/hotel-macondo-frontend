import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../models/rol.model';
import { UsuarioService } from '../services/usuario.service';

export const sesionGuard: CanActivateFn = (route) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const sesion = usuarioService.obtenerSesion();
  if (!sesion) return router.parseUrl('/login');

  const rolesPermitidos = route.data['roles'] as Rol[];
  if (!rolesPermitidos.some((rol) => sesion.roles.includes(rol))) {
    return router.parseUrl(usuarioService.rutaInicio(sesion));
  }
  if (
    rolesPermitidos.includes('CLIENTE') &&
    Number(route.paramMap.get('id')) !== sesion.clienteId
  ) {
    return router.parseUrl(usuarioService.rutaInicio(sesion));
  }
  return true;
};

// Home y login recuperan la sesión guardada y abren el portal del rol correspondiente.
export const inicioGuard: CanActivateFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const sesion = usuarioService.obtenerSesion();
  return sesion ? router.parseUrl(usuarioService.rutaInicio(sesion)) : true;
};
