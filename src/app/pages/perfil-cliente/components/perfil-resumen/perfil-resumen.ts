import { Component, input } from '@angular/core';

@Component({
  selector: 'app-perfil-resumen',
  templateUrl: './perfil-resumen.html',
})
export class PerfilResumen {
  nombreCompleto = input.required<string>();
  correo = input.required<string>();
}