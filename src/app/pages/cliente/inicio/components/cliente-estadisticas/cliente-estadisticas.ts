import { Component, input } from '@angular/core';

// Bloque con estadísticas básicas del cliente; muestra "—" mientras no hay dato.
@Component({
  selector: 'app-cliente-estadisticas',
  templateUrl: './cliente-estadisticas.html',
})
export class ClienteEstadisticas {
  cargando = input(true);
  noches = input(0);
  activas = input(0);
  estadias = input(0);
  proximas = input(0);

  // Muestra el valor o "—" si todavía se está cargando.
  valor(n: number): string {
    return this.cargando() ? '—' : String(n);
  }
}
