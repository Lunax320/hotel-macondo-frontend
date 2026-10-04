import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Servicio } from '../../../../models/servicio.model';
import { BotonesFormulario } from '../botones-formulario/botones-formulario';
import { ServicioCamposBasicos } from '../servicio-campos-basicos/servicio-campos-basicos';
import { ServicioCamposExtra } from '../servicio-campos-extra/servicio-campos-extra';
import { ServicioCamposDetalle } from '../servicio-campos-detalle/servicio-campos-detalle';

// Formulario de servicio: guarda el FormGroup, lo llena al editar y emite el servicio listo.
@Component({
  imports: [
    ReactiveFormsModule,
    ServicioCamposBasicos,
    ServicioCamposDetalle,
    ServicioCamposExtra,
    BotonesFormulario,
  ],
  selector: 'app-servicio-formulario',
  styleUrl: './servicio-formulario.scss',
  templateUrl: './servicio-formulario.html',
})
export class ServicioFormulario implements OnInit {
  servicio = input<Servicio>();
  guardado = output<Servicio>();

  categorias = ['Bienestar', 'Gastronomía', 'Aventura', 'Exclusivo'];
  imagenesDisponibles = [
    '/images/Spa.avif',
    '/images/Restaurante.avif',
    '/images/Piscina.avif',
    '/images/PlayaPriv.avif',
    '/images/Guiado.avif',
    '/images/Eventos.avif',
  ];

  servicioForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    descripcionDetalle: new FormControl(''),
    imagen: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    duracion: new FormControl(''),
    horario: new FormControl(''),
    destacado: new FormControl(false),
    activo: new FormControl(true),
    incluidos: new FormControl(''),
    etiquetas: new FormControl(''),
  });

  // Al editar, la página ya trae el servicio cargado y aquí se pasa al formulario.
  ngOnInit(): void {
    const servicio = this.servicio();

    if (servicio) {
      this.servicioForm.patchValue({
        nombre: servicio.nombre,
        categoria: servicio.categoria,
        descripcion: servicio.descripcion,
        precio: String(servicio.precio),
        destacado: servicio.destacado,
        activo: servicio.activo,
        descripcionDetalle: servicio.descripcionDetalle ?? '',
        imagen: servicio.imagen ?? '',
        duracion: servicio.duracion ?? '',
        horario: servicio.horario ?? '',
        incluidos: servicio.incluidos?.join(', ') ?? '',
        etiquetas: servicio.etiquetas?.join(', ') ?? '',
      });
    }
  }

  guardar(): void {
    if (this.servicioForm.invalid) {
      return;
    }

    const valor = this.servicioForm.value;

    this.guardado.emit({
      id: this.servicio()?.id,
      nombre: valor.nombre?.trim() ?? '',
      categoria: valor.categoria ?? '',
      descripcion: valor.descripcion?.trim() ?? '',
      descripcionDetalle: valor.descripcionDetalle?.trim() ?? '',
      imagen: valor.imagen?.trim() ?? '',
      precio: Number(valor.precio),
      duracion: valor.duracion?.trim() ?? '',
      horario: valor.horario?.trim() ?? '',
      destacado: valor.destacado ?? false,
      activo: valor.activo ?? true,
      incluidos: this.textoALista(valor.incluidos),
      etiquetas: this.textoALista(valor.etiquetas),
    });
  }

  // "Masaje, Vapor" -> ['Masaje', 'Vapor']
  private textoALista(texto: string | null | undefined): string[] {
    return (texto ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}
