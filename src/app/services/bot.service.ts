import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the Bot interface according to your backend schema
export interface Bot {
  _id: string;
  name: string;
  sessionId: string;
  status: 'active' | 'inactive' | 'pairing' | 'error';
  empresa?: any; // or a more specific type
  qr?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BotService {
  private apiUrl = 'http://localhost:3000/bots'; // Adjust if your backend URL is different

  constructor(private http: HttpClient) { }

  getBots(): Observable<Bot[]> {
    return this.http.get<Bot[]>(this.apiUrl);
  }

  createBot(name: string, empresaId?: string): Observable<Bot> {
    return this.http.post<Bot>(this.apiUrl, { name, empresaId });
  }

  deleteBot(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  activateBot(id: string): Observable<Bot> {
    return this.http.patch<Bot>(`${this.apiUrl}/${id}/activate`, {});
  }

  inactivateBot(id: string): Observable<Bot> {
    return this.http.patch<Bot>(`${this.apiUrl}/${id}/inactivate`, {});
  }

  getBot(id: string): Observable<Bot> {
    return this.http.get<Bot>(`${this.apiUrl}/${id}`);
  }
}
