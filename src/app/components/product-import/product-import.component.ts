import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpresaService } from '../../services/empresa.service'; // Corrected import

interface ImportResponse {
  message: string;
  created: number;
  updated: number;
  errors: any[];
}

@Component({
  selector: 'app-product-import',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})
export class ProductImportComponent {
  
  selectedEmpresaId: string = '';
  selectedFile: File | null = null;
  uploadMessage: string = '';
  isError: boolean = false;

  constructor(
    private empresaService: EmpresaService, // Corrected injection
    @Inject(MAT_DIALOG_DATA) public data: { empresaId: string }
  ) {
    this.selectedEmpresaId = data.empresaId;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (!this.selectedEmpresaId || !this.selectedFile) {
      this.uploadMessage = 'Por favor, selecciona un archivo.';
      this.isError = true;
      return;
    }

    this.uploadMessage = 'Subiendo archivo...';
    this.isError = false;

    this.empresaService.importProducts(this.selectedEmpresaId, this.selectedFile, 'excel').subscribe({
      next: (response: ImportResponse) => { // Added type for response
        this.uploadMessage = `¡Éxito! Productos creados: ${response.created}, actualizados: ${response.updated}.`;
        this.isError = false;
      },
      error: (err: HttpErrorResponse) => {
        const serverError = err.error;
        const defaultMessage = 'Ocurrió un error desconocido al procesar el archivo';
        
        const detail = this.formatErrorDetails(serverError);

        this.uploadMessage = serverError?.message ? `${serverError.message}. ${detail}` : `${defaultMessage}. ${detail}`;
        this.isError = true;
      }
    });
  }

  private formatErrorDetails(serverError: any): string {
    if (serverError && Array.isArray(serverError.errors) && serverError.errors.length > 0) {
      const formattedErrors = serverError.errors.map((e: any) => 
        `Fila ${e.row}: ${Array.isArray(e.errors) ? e.errors.join(', ') : 'Error desconocido'}`
      ).join('; ');
      return `Detalles: ${formattedErrors}`; 
    }
    return 'No se proporcionaron detalles adicionales.';
  }
}
