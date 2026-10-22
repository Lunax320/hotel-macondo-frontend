import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-reservas-filtros',
  styleUrl: './reservas-filtros.scss',
  templateUrl: './reservas-filtros.html',
})
export class ReservasFiltros {
  textoBusqueda = input('');
  filtro = input('todas');
  busquedaCambiada = output<string>();
  filtroCambiado = output<string>();
}
