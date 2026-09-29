import { Routes } from '@angular/router';
import { DetalleHabitacion } from './pages/detalle-habitacion/detalle-habitacion';
import { Habitaciones } from './pages/habitaciones/habitaciones';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';

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
    path: 'habitaciones',
    component: Habitaciones,
  },
  {
    path: 'habitaciones/:id',
    component: DetalleHabitacion,
  },
];
