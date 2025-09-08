import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// It's better to move this to its own file, e.g., app/models/empresa.model.ts
export interface Empresa {
  _id: string;
  code: string;
  nombre: string;
  telefono?: string;
  whatsApp: string;
  email?: string;
  direccion?: string;
  geoUbicacion?: any;
  saludoBienvenida?: string;
  saludoDespedida?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:3000/empresas'; // Should be in environment files

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  getEmpresa(id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  createEmpresa(empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  updateEmpresa(id: string, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.patch<Empresa>(`${this.apiUrl}/${id}`, empresa);
  }

  deleteEmpresa(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
