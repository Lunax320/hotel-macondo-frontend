import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-landing-chat',
  templateUrl: './landing-chat.html',
  styleUrl: './landing-chat.scss',
})
export class LandingChat {
  abierto = false;
}
