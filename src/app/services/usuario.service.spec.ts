import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;

  beforeEach(() => {
    usuarioService = TestBed.inject(UsuarioService);
  });

  it('autentica un usuario local existente', () => {
    expect(usuarioService.autenticar('ADMIN@macondo.com', 'admin')?.rol).toBe('ADMINISTRADOR');
  });
});
