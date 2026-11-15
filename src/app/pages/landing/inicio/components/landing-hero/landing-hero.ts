import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-landing-hero',
  styleUrl: './landing-hero.scss',
  templateUrl: './landing-hero.html',
})
export class LandingHero {
  // Algunos navegadores ignoran autoplay: al estar listo el video se reproduce a la fuerza (silenciado)
  reproducir(evento: Event): void {
    (evento.target as HTMLVideoElement).play().catch(() => {});
  }

  // Pausa o reanuda el video de fondo al hacer clic en el botón del hero
  alternarVideo(video: HTMLVideoElement): void {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}
