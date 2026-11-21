import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Invitación al recorrido simulado 360 del hotel (/explorar).
@Component({
  imports: [RouterLink],
  selector: 'app-landing-recorrido',
  styleUrl: './landing-recorrido.scss',
  templateUrl: './landing-recorrido.html',
})
export class LandingRecorrido {}
