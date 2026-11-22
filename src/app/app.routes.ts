import { Routes } from '@angular/router';
import { inicioGuard, sesionGuard } from './helpers/sesion.guard';
import { DetalleServicio } from './pages/landing/detalle-servicio/detalle-servicio';
import { DetalleHabitacion } from './pages/landing/detalle-habitacion/detalle-habitacion';
import { Habitaciones } from './pages/landing/habitaciones/habitaciones';
import { Landing } from './pages/landing/inicio/landing';
import { Login } from './pages/autenticacion/login/login';
import { Registro } from './pages/autenticacion/registro/registro';
import { RecuperarContrasena } from './pages/autenticacion/recuperar-contrasena/recuperar-contrasena';
import { RestablecerContrasena } from './pages/autenticacion/restablecer-contrasena/restablecer-contrasena';
import { Servicios } from './pages/landing/servicios/servicios';
import { AdminHabitaciones } from './pages/admin/habitaciones/admin-habitaciones';
import { AdminHabitacionForm } from './pages/admin/habitacion-form/admin-habitacion-form';
import { AdminTiposHabitacion } from './pages/admin/tipos-habitacion/admin-tipos-habitacion';
import { Operador } from './pages/operador/inicio/operador';
import { OperadorDetalleReserva } from './pages/operador/detalle-reserva/detalle-reserva';
import { OperadorReservas } from './pages/operador/reservas/reservas';
import { OperadorCuentaHabitacion } from './pages/operador/cuenta-habitacion/cuenta-habitacion';
import { OperadorBuscarCuenta } from './pages/operador/buscar-cuenta/buscar-cuenta';
import { OperadorCheckout } from './pages/operador/checkout/checkout';
import { AdminServicios } from './pages/admin/servicios/admin-servicios';
import { AdminServicioForm } from './pages/admin/servicio-form/admin-servicio-form';
import { PortalCliente } from './pages/cliente/inicio/cliente';
import { AdminInicio } from './pages/admin/inicio/admin-inicio';
import { AdminOperadores } from './pages/admin/operadores/admin-operadores';
import { PerfilCliente } from './pages/cliente/perfil-cliente/perfil-cliente';
import { CrearReserva } from './pages/cliente/crear-reserva/crear-reserva';
import { HistorialReservas } from './pages/cliente/historial-reservas/historial-reservas';
import { HistorialPagos } from './pages/cliente/historial-pagos/historial-pagos';
import { ReservasActivas } from './pages/cliente/reservas-activas/reservas-activas';
import { ReservaDetalleClientePage } from './pages/cliente/reserva-detalle/reserva-detalle';
import { Explorar } from './pages/landing/explorar/explorar';
import { Promociones } from './pages/landing/promociones/promociones';
import { AdminPromociones } from './pages/admin/promociones/admin-promociones';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [inicioGuard],
    component: Landing,
  },
  {
    path: 'login',
    canActivate: [inicioGuard],
    component: Login,
  },
  {
    path: 'registro',
    component: Registro,
  },
  {
    path: 'recuperar-contrasena',
    component: RecuperarContrasena,
  },
  {
    path: 'restablecer-contrasena',
    component: RestablecerContrasena,
  },
  {
    path: 'habitaciones',
    component: Habitaciones,
  },
  {
    path: 'habitaciones/:id',
    component: DetalleHabitacion,
  },
  { path: 'explorar', component: Explorar },
  { path: 'promociones', component: Promociones },
  {
    path: 'servicios',
    component: Servicios,
  },
  {
    path: 'servicios/:id',
    component: DetalleServicio,
  },
  {
    path: 'operador/reservas/:numeroReserva',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: OperadorDetalleReserva,
  },
  {
    path: 'operador/reservas',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: OperadorReservas,
  },
  {
    path: 'operador/cuenta',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: OperadorBuscarCuenta,
  },
  {
    path: 'operador/cuenta/:reservaId',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: OperadorCuentaHabitacion,
  },
  {
    path: 'operador/checkout',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: OperadorCheckout,
  },
  {
    path: 'operador',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR', 'OPERADOR'] },
    component: Operador,
  },
  {
    path: 'cliente/:id',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: PortalCliente,
  },
  {
    path: 'cliente/:id/reservas',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: ReservasActivas,
  },
  {
    path: 'cliente/:id/historial',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: HistorialReservas,
  },
  {
    path: 'cliente/:id/pagos',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: HistorialPagos,
  },
  {
    path: 'cliente/:id/reservas/nueva',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: CrearReserva,
  },
  {
    path: 'cliente/:id/reservas/:reservaId/editar',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: CrearReserva,
  },
  {
    path: 'cliente/:id/reservas/:reservaId',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: ReservaDetalleClientePage,
  },
  {
    path: 'cliente/:id/perfil',
    canActivate: [sesionGuard],
    data: { roles: ['CLIENTE'] },
    component: PerfilCliente,
  },
  {
    path: 'admin',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminInicio,
  },
  {
    path: 'admin/operadores',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminOperadores,
  },
  {
    path: 'admin/promociones',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminPromociones,
  },
  {
    path: 'admin/habitaciones/nueva',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminHabitacionForm,
  },
  {
    path: 'admin/habitaciones/editar/:id',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminHabitacionForm,
  },
  {
    path: 'admin/habitaciones',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminHabitaciones,
  },
  {
    path: 'admin/tipos_habitacion',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminTiposHabitacion,
  },
  {
    path: 'admin/servicios/nuevo',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminServicioForm,
  },
  {
    path: 'admin/servicios/editar/:id',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminServicioForm,
  },
  {
    path: 'admin/servicios',
    canActivate: [sesionGuard],
    data: { roles: ['ADMINISTRADOR'] },
    component: AdminServicios,
  },
];
