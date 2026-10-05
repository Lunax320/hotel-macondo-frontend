import { TestBed } from '@angular/core/testing';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;

  const cliente = {
    id: 99,
    nombre: 'Ana',
    apellido: 'Ríos',
    cedula: '1',
    telefono: '3000000',
    correo: 'ana@macondo.com',
  };

  beforeEach(() => {
    usuarioService = TestBed.inject(UsuarioService);
  });

  it('registrarCliente crea un usuario CLIENTE que luego puede iniciar sesión', () => {
    let registrado: Usuario | null = null;
    usuarioService.registrarCliente(cliente, 'secreta').subscribe((u) => (registrado = u));

    expect(registrado!.rol).toBe('CLIENTE');
    expect(usuarioService.autenticar('ana@macondo.com', 'secreta')?.cliente?.id).toBe(99);
  });

  it('registrarCliente rechaza un correo ya registrado sin importar mayúsculas', () => {
    let registrado: Usuario | null | undefined;
    usuarioService
      .registrarCliente({ ...cliente, correo: 'URSULA@macondo.com' }, 'secreta')
      .subscribe((u) => (registrado = u));

    expect(registrado).toBeNull();
  });
});
