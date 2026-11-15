import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonio } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonioService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/testimonio';

  obtenerTodos(): Observable<Testimonio[]> {
    return this.http.get<Testimonio[]>(this.url);
  }
}