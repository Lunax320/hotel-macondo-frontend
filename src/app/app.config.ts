import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { routes } from './app.routes';

registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 22 viene sin zone.js: se activa para que la vista se actualice sola
    // cuando llegan las respuestas HTTP dentro de un subscribe (como en el proyecto del profe).
    provideZoneChangeDetection({ eventCoalescing: true }),
    // HttpClient para consumir la API REST de Spring Boot.
    provideHttpClient(),
    provideRouter(routes),
  ],
};
