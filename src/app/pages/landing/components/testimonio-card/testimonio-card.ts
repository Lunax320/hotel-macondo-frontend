import { Component, input } from '@angular/core';
import { Testimonio } from '../../../../models/testimonio.model';

@Component({
  imports: [],
  selector: 'app-testimonio-card',
  styleUrl: './testimonio-card.scss',
  templateUrl: './testimonio-card.html',
})
export class TestimonioCard {
  testimonio = input<Testimonio>();
}
