import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';

// Asumimos que la URL base de la API está configurada globalmente,
// pero la definimos aquí por claridad.
const API_URL = 'http://localhost:3000'; // Reemplazar con la URL real de tu backend

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${API_URL}/empresas`);
  }

  // Aquí se podrían añadir otros métodos para el CRUD de empresas
}
