import { Component } from '@angular/core';
import { OperadorSidebar } from '../../../components/operador-sidebar/operador-sidebar';
import { ReservasEstadisticas } from './components/reservas-estadisticas/reservas-estadisticas';
import { ReservasTabla } from './components/reservas-tabla/reservas-tabla';

@Component({
  imports: [OperadorSidebar, ReservasEstadisticas, ReservasTabla],
  selector: 'app-operador-reservas',
  styleUrl: './reservas.scss',
  templateUrl: './reservas.html',
})
export class OperadorReservas {}
