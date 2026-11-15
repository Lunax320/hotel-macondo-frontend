import { API_BASE } from '../config/api';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonio } from '../models/testimonio.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonioService {
  private http = inject(HttpClient);
  private url = `${API_BASE}/api/testimonio`;

  obtenerTodos(): Observable<Testimonio[]> {
    return this.http.get<Testimonio[]>(this.url);
  }
}