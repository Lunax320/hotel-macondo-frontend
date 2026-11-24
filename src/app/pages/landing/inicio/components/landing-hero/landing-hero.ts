import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-landing-hero',
  styleUrl: './landing-hero.scss',
  templateUrl: './landing-hero.html',
})
export class LandingHero {
  readonly animarFondo = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  reproducir(evento: Event): void {
    (evento.target as HTMLVideoElement).play().catch(() => {});
  }
}
