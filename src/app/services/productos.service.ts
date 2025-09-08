import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000'; // Reemplazar con la URL real de tu backend

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  importProducts(file: File, empresaId: string, fileType: 'excel' | 'json'): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('empresaId', empresaId);
    formData.append('fileType', fileType);

    // No es necesario establecer Content-Type, el navegador lo hace por nosotros con FormData
    return this.http.post<any>(`${API_URL}/productos/import`, formData);
  }

  uploadImages(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file, file.name);
    });

    return this.http.post<{ urls: string[] }>(`${API_URL}/productos/upload-assets`, formData);
  }

  // Aquí se podrían añadir otros métodos para el CRUD de productos
}
