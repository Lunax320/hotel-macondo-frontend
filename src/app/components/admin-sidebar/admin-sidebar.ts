import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Menu lateral del panel admin; resalta la seccion activa.
@Component({
  imports: [RouterLink],
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.scss',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  seccionActiva = input<string>('habitaciones');

  // Secciones del menu, en el mismo orden que el admin de Thymeleaf.
  secciones = [
    { clave: 'inicio', ruta: '/admin', icono: 'bi-grid-1x2', texto: 'Tablero' },
    {
      clave: 'operadores',
      ruta: '/admin/operadores',
      icono: 'bi-person-badge',
      texto: 'Operadores',
    },
    { clave: 'servicios', ruta: '/admin/servicios', icono: 'bi-stars', texto: 'Servicios' },
    {
      clave: 'tipos_habitacion',
      ruta: '/admin/tipos_habitacion',
      icono: 'bi-tag',
      texto: 'Tipo Habitación',
    },
    {
      clave: 'habitaciones',
      ruta: '/admin/habitaciones',
      icono: 'bi-door-closed',
      texto: 'Habitaciones',
    },
  ];
}
