import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-admin-sidebar',
  styleUrl: './admin-sidebar.scss',
  templateUrl: './admin-sidebar.html',
})
export class AdminSidebar {
  seccionActiva = input<string>('habitaciones');
}
