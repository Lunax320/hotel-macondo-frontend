import { Routes } from '@angular/router';
import { DetalleServicio } from './pages/detalle-servicio/detalle-servicio';
import { DetalleHabitacion } from './pages/detalle-habitacion/detalle-habitacion';
import { Habitaciones } from './pages/habitaciones/habitaciones';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Servicios } from './pages/servicios/servicios';
import { AdminHabitaciones } from './pages/admin-habitaciones/admin-habitaciones';
import { AdminHabitacionForm } from './pages/admin-habitacion-form/admin-habitacion-form';
import { AdminTiposHabitacion } from './pages/admin-tipos-habitacion/admin-tipos-habitacion';
import { Operador } from './pages/operador/operador';
import { OperadorDetalleReserva } from './pages/operador/detalle-reserva/detalle-reserva';
import { OperadorReservas } from './pages/operador/reservas/reservas';
import { AdminServicios } from './pages/admin-servicios/admin-servicios';
import { AdminServicioForm } from './pages/admin-servicio-form/admin-servicio-form';
import { PortalCliente } from './pages/cliente/cliente';
import { AdminInicio } from './pages/admin-inicio/admin-inicio';
import { AdminOperadores } from './pages/admin-operadores/admin-operadores';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registro',
    component: Registro,
  },
  {
    path: 'habitaciones',
    component: Habitaciones,
  },
  {
    path: 'habitaciones/:id',
    component: DetalleHabitacion,
  },
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
    component: OperadorDetalleReserva,
  },
  {
    path: 'operador/reservas',
    component: OperadorReservas,
  },
  {
    path: 'operador',
    component: Operador,
  },
  {
    path: 'cliente/:id',
    component: PortalCliente,
  },
  {
    path: 'admin',
    component: AdminInicio,
  },
  {
    path: 'admin/operadores',
    component: AdminOperadores,
  },
  {
    path: 'admin/habitaciones/nueva',
    component: AdminHabitacionForm,
  },
  {
    path: 'admin/habitaciones/editar/:id',
    component: AdminHabitacionForm,
  },
  {
    path: 'admin/habitaciones',
    component: AdminHabitaciones,
  },
  {
    path: 'admin/tipos_habitacion',
    component: AdminTiposHabitacion,
  },
  {
    path: 'admin/servicios/nuevo',
    component: AdminServicioForm,
  },
  {
    path: 'admin/servicios/editar/:id',
    component: AdminServicioForm,
  },
  {
    path: 'admin/servicios',
    component: AdminServicios,
  },
];
