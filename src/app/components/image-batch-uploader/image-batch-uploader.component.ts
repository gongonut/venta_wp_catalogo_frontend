import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmpresaService } from '../../services/empresa.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-batch-uploader',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './image-batch-uploader.component.html',
  styleUrls: ['./image-batch-uploader.component.css']
})
export class ImageBatchUploaderComponent {
  selectedFiles: File[] = [];
  uploadedUrls: string[] = [];
  uploadMessage: string = '';
  isError: boolean = false;
  empresaId: string;

  constructor(
    private empresaService: EmpresaService,
    @Inject(MAT_DIALOG_DATA) public data: { empresaId: string }
  ) {
    this.empresaId = data.empresaId;
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onUpload(): void {
    if (this.selectedFiles.length === 0) {
      this.uploadMessage = 'Por favor, selecciona al menos una imagen.';
      this.isError = true;
      return;
    }

    this.uploadMessage = 'Subiendo imágenes...';
    this.isError = false;
    this.uploadedUrls = [];

    this.empresaService.uploadProductImages(this.selectedFiles).subscribe({
      next: (response) => {
        this.uploadMessage = `¡Éxito! Se subieron ${response.urls.length} imágenes.`;
        this.uploadedUrls = response.urls;
        this.isError = false;
      },
      error: (error) => {
        this.uploadMessage = `Error en la subida: ${error.error?.message || 'Error desconocido.'}`;
        this.isError = true;
      }
    });
  }
}
