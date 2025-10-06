import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';
import { Producto } from '../models/producto.model';

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

  // --- Métodos para Productos ---

  getProducts(empresaId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/${empresaId}/productos`);
  }

  getProduct(empresaId: string, sku: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${empresaId}/productos/${sku}`);
  }

  addProduct(empresaId: string, productDto: any, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('fotos', file, file.name);
    });
    formData.append('data', JSON.stringify(productDto));

    return this.http.post<any>(`${this.apiUrl}/${empresaId}/productos`, formData);
  }

  updateProduct(empresaId: string, sku: string, product: Partial<Producto>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${empresaId}/productos/${sku}`, product);
  }

  createProduct(empresaId: string, product: Partial<Producto>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${empresaId}/productos`, product);
  }

  deleteProduct(empresaId: string, sku: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${empresaId}/productos/${sku}`);
  }

  importProducts(empresaId: string, file: File, fileType: 'excel' | 'json'): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('fileType', fileType);

    return this.http.post<any>(`${this.apiUrl}/${empresaId}/productos/import`, formData);
  }

  uploadProductImages(files: File[]): Observable<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file, file.name);
    });

    return this.http.post<{ urls: string[] }>(`${this.apiUrl}/productos/upload-assets`, formData);
  }
}
