import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Reserva } from '../../../../../models/reserva.model';

@Component({
  selector: 'app-historial-item',
  imports: [DecimalPipe],
  templateUrl: './historial-item.html',
})
export class HistorialItem {
  reserva = input.required<Reserva>();
}