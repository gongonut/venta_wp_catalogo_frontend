import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from '../../../services/empresas.service';
import { ProductosService } from '../../../services/productos.service';
import { Empresa } from '../../../models/empresa.model';

@Component({
  selector: 'app-producto-import',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-import.component.html',
  styleUrls: ['./producto-import.component.css']
})
export class ProductoImportComponent implements OnInit {
  empresas: Empresa[] = [];
  selectedEmpresa: string = '';
  isEmpresaFromRoute = false;
  fileType: 'excel' | 'json' = 'excel';
  selectedFile: File | null = null;
  feedbackMessage: string = '';
  isError: boolean = false;

  private empresasService = inject(EmpresasService);
  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit(): void {
    this.loadEmpresas();
    this.route.paramMap.subscribe(params => {
      const empresaId = params.get('empresaId');
      if (empresaId) {
        this.selectedEmpresa = empresaId;
        this.isEmpresaFromRoute = true;
      }
    });
  }

  loadEmpresas(): void {
    this.empresasService.getEmpresas().subscribe({
      next: (data) => {
        this.empresas = data;
      },
      error: (err) => {
        this.feedbackMessage = 'Error al cargar las empresas.';
        this.isError = true;
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.feedbackMessage = '';
      this.isError = false;
    }
  }

  onUpload(): void {
    if (!this.selectedFile || !this.selectedEmpresa) {
      this.feedbackMessage = 'Por favor, selecciona una empresa y un archivo.';
      this.isError = true;
      return;
    }

    this.feedbackMessage = 'Subiendo y procesando archivo...';
    this.isError = false;

    this.productosService.importProducts(this.selectedFile, this.selectedEmpresa, this.fileType).subscribe({
      next: (response) => {
        this.feedbackMessage = `Proceso completado: ${response.message}`;
        this.isError = false;
      },
      error: (err) => {
        this.feedbackMessage = `Error en la importación: ${err.error.message || 'Ocurrió un error desconocido.'}`;
        this.isError = true;
        console.error(err);
      }
    });
  }
}
