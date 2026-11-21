import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonio } from '../models/testimonio.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestimonioService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/testimonio';

  obtenerTodos(): Observable<Testimonio[]> {
    return this.http.get<Testimonio[]>(this.url);
  }
}
