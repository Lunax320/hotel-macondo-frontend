import { Component, input } from '@angular/core';

@Component({
  selector: 'app-perfil-resumen',
  templateUrl: './perfil-resumen.html',
})
export class PerfilResumen {
  nombreCompleto = input.required<string>();
  correo = input.required<string>();

  // Dos iniciales del nombre (primera letra del nombre y del apellido), para el avatar.
  iniciales(): string {
    const partes = this.nombreCompleto().trim().split(/\s+/).filter(Boolean);
    const primera = partes[0]?.charAt(0) ?? '';
    const ultima = partes.length > 1 ? (partes[partes.length - 1]?.charAt(0) ?? '') : '';
    return (primera + ultima).toUpperCase() || '?';
  }
}