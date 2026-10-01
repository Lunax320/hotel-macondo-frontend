import { Component, input } from '@angular/core';
import { Testimonio } from '../../../../models/testimonio.model';
import { TestimonioCard } from '../testimonio-card/testimonio-card';

@Component({
  imports: [TestimonioCard],
  selector: 'app-landing-testimonios',
  styleUrl: './landing-testimonios.scss',
  templateUrl: './landing-testimonios.html',
})
export class LandingTestimonios {
  testimonios = input<Testimonio[]>();
}
