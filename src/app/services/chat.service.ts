import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChatMessage, ChatRequest, ChatResponse } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  conversar(mensaje: string, historial: ChatMessage[]): Observable<ChatResponse> {
    const request: ChatRequest = { mensaje, historial };
    return this.http.post<ChatResponse>(`${environment.apiUrl}/chat`, request);
  }
}
