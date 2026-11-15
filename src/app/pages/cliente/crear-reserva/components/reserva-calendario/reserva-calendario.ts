import { ChangeDetectionStrategy, Component, DoCheck, ElementRef, inject, input, OnDestroy, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, from, map, mergeMap, Observable, of, Subscription, toArray } from 'rxjs';
import { ReservaService } from '../../../../../services/reserva.service';

interface Celda {
  iso: string;
  dia: number;
  pasado: boolean;
  sinDisp: boolean;
  esEntrada: boolean;
  esSalida: boolean;
  enRango: boolean;
  etiqueta: string;
}

const DIAS_MS = 86_400_000;

@Component({
  selector: 'app-reserva-calendario',
  styleUrl: './reserva-calendario.scss',
  templateUrl: './reserva-calendario.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ReservaCalendario implements DoCheck, OnDestroy {
  private reservaService = inject(ReservaService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private consulta?: Subscription;
  // Disponibilidad por mes + tipo + personas: fecha ISO -> hay habitación esa noche.
  private cache = new Map<string, Map<string, boolean>>();
  private claveActual = '';

  formulario = input.required<FormGroup>();
  clienteId = input.required<number>();
  reservaId = input<number | undefined>(undefined);
  fechaMinima = input.required<string>();
  criteriosCambiados = output<void>();

  mes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  cargando = false;
  readonly diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  // Detecta cambios de tipo/personas/mes (también los hechos desde el formulario) y consulta lo que falte.
  ngDoCheck(): void {
    const clave = this.clave();
    if (clave !== this.claveActual) {
      this.claveActual = clave;
      this.cargar();
    }
  }

  ngOnDestroy(): void {
    this.consulta?.unsubscribe();
  }

  get entrada(): string {
    return this.formulario().get('fechaEntrada')?.value ?? '';
  }

  get salida(): string {
    return this.formulario().get('fechaSalida')?.value ?? '';
  }

  get titulo(): string {
    const t = this.mes.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  get esMesActual(): boolean {
    return this.iso(this.mes) <= this.fechaMinima().slice(0, 7) + '-01';
  }

  get hayTipo(): boolean {
    return !!Number(this.formulario().get('tipoId')?.value);
  }

  // Celdas del mes (null = hueco antes del día 1), semana desde el lunes.
  get celdas(): (Celda | null)[] {
    const disp = this.cache.get(this.clave());
    const entrada = this.entrada;
    const salida = this.salida;
    const huecos = (this.mes.getDay() + 6) % 7;
    const total = new Date(this.mes.getFullYear(), this.mes.getMonth() + 1, 0).getDate();
    const lista: (Celda | null)[] = Array(huecos).fill(null);
    for (let d = 1; d <= total; d++) {
      const fecha = new Date(this.mes.getFullYear(), this.mes.getMonth(), d);
      const iso = this.iso(fecha);
      const pasado = iso < this.fechaMinima();
      const sinDisp = !pasado && disp?.get(iso) === false;
      const esEntrada = iso === entrada;
      const esSalida = iso === salida;
      const enRango = !!entrada && !!salida && iso > entrada && iso < salida;
      const estado = esEntrada ? ', entrada' : esSalida ? ', salida' : enRango ? ', dentro de la estadía' : '';
      const nota = pasado ? ', fecha pasada' : sinDisp ? ', sin disponibilidad' : '';
      lista.push({
        iso,
        dia: d,
        pasado,
        sinDisp,
        esEntrada,
        esSalida,
        enRango,
        etiqueta:
          fecha.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
          estado +
          nota,
      });
    }
    return lista;
  }

  // Solo hay un tabindex=0: la entrada elegida o, si no, el primer día elegible del mes.
  get ancla(): string {
    const c = this.celdas.filter((x): x is Celda => !!x);
    return (c.find((x) => x.esEntrada) ?? c.find((x) => !x.pasado))?.iso ?? '';
  }

  cambiarMes(delta: number): void {
    this.mes = new Date(this.mes.getFullYear(), this.mes.getMonth() + delta, 1);
  }

  // Primero entrada, luego salida posterior; cualquier otro clic reinicia con ese día como entrada.
  elegir(c: Celda): void {
    if (c.pasado) return;
    const form = this.formulario();
    const entrada = this.entrada;
    const salida = this.salida;
    const puedeSalir = entrada && !salida && c.iso > entrada && !this.hayNocheBloqueada(entrada, c.iso);
    if (puedeSalir) {
      form.patchValue({ fechaSalida: c.iso });
    } else if (!c.sinDisp) {
      form.patchValue({ fechaEntrada: c.iso, fechaSalida: '' });
    } else {
      return;
    }
    form.get('fechaEntrada')?.markAsTouched();
    form.get('fechaSalida')?.markAsTouched();
    this.criteriosCambiados.emit();
  }

  // Flechas mueven el foco entre días (±1 día, ±7 días); salta los deshabilitados.
  teclado(evento: KeyboardEvent): void {
    const pasos: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const paso = pasos[evento.key];
    if (!paso) return;
    const botones = Array.from(this.host.nativeElement.querySelectorAll<HTMLButtonElement>('button.dia:not(:disabled)'));
    const i = botones.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const destino = botones[i + paso] ?? botones[paso < 0 ? 0 : botones.length - 1];
    evento.preventDefault();
    destino.focus();
  }

  private hayNocheBloqueada(desde: string, hasta: string): boolean {
    const cache = this.cache;
    for (let t = this.ms(desde); t < this.ms(hasta); t += DIAS_MS) {
      const f = new Date(t);
      const mapa = cache.get(this.claveDe(f));
      if (mapa?.get(this.iso(f)) === false) return true;
    }
    return false;
  }

  private personas(): number {
    const n = Number(this.formulario().get('cantidadPersonas')?.value);
    return Number.isInteger(n) && n >= 1 ? n : 1;
  }

  private claveDe(mes: Date): string {
    const tipo = Number(this.formulario().get('tipoId')?.value);
    return tipo ? `${tipo}|${this.personas()}|${this.iso(mes).slice(0, 7)}` : '';
  }

  private clave(): string {
    return this.claveDe(this.mes);
  }

  // Una consulta por noche (hoy en adelante) del mes visible. Se lanzan en paralelo con mergeMap
  // y toArray junta los resultados en un solo subscribe.
  private cargar(): void {
    this.consulta?.unsubscribe();
    this.cargando = false;
    const clave = this.claveActual;
    const tipoId = Number(this.formulario().get('tipoId')?.value);
    if (!clave || this.cache.has(clave)) return;
    const personas = this.personas();
    const total = new Date(this.mes.getFullYear(), this.mes.getMonth() + 1, 0).getDate();
    const peticiones: Observable<[string, boolean]>[] = [];
    for (let d = 1; d <= total; d++) {
      const dia = new Date(this.mes.getFullYear(), this.mes.getMonth(), d);
      const iso = this.iso(dia);
      if (iso < this.fechaMinima()) continue;
      const sig = this.iso(new Date(dia.getFullYear(), dia.getMonth(), d + 1));
      peticiones.push(
        this.reservaService
          .consultarDisponibilidad(this.clienteId(), tipoId, { fechaInicio: iso, fechaFin: sig, cantidadPersonas: personas }, this.reservaId())
          .pipe(
            map((h): [string, boolean] => [iso, h.length > 0]),
            // Si una noche falla no se marca como llena: la validación real ocurre al consultar.
            catchError(() => of<[string, boolean]>([iso, true])),
          ),
      );
    }
    if (!peticiones.length) return;
    this.cargando = true;
    this.consulta = from(peticiones)
      .pipe(
        mergeMap((peticion) => peticion),
        toArray(),
      )
      .subscribe((pares) => {
      this.cache.set(clave, new Map(pares));
      this.cargando = false;
    });
  }

  private ms(iso: string): number {
    return new Date(`${iso}T00:00:00`).getTime();
  }

  private iso(f: Date): string {
    return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
  }
}
