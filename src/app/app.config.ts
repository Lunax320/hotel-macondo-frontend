import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Angular 22 viene sin zone.js: se activa para que la vista se actualice sola
    // cuando llegan las respuestas HTTP dentro de un subscribe (como en el proyecto del profe).
    provideZoneChangeDetection({ eventCoalescing: true }),
    // HttpClient para consumir la API REST de Spring Boot.
    provideHttpClient(),
    provideRouter(routes),
  ],
};
