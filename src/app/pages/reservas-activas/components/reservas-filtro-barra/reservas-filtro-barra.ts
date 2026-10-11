import { Component, output } from '@angular/core';

@Component({
  selector: 'app-reservas-filtro-barra',
  templateUrl: './reservas-filtro-barra.html',
})
export class ReservasFiltroBarra {
  filtroSeleccionado = 'TODOS';
  cambioFiltro = output<string>();

  seleccionar(estado: string): void {
    this.filtroSeleccionado = estado;
    this.cambioFiltro.emit(estado);
  }
}