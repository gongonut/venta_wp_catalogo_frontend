import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Empresa, EmpresaService } from '../../../services/empresa.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImageBatchUploaderComponent } from '../../image-batch-uploader/image-batch-uploader.component';
import { ProductImportComponent } from '../../product-import/product-import.component';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './empresa-list.component.html',
  styleUrl: './empresa-list.component.css'
})
export class EmpresaListComponent implements OnInit {
  empresas$: Observable<Empresa[]> | undefined;

  constructor(
    private empresaService: EmpresaService, 
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.empresas$ = this.empresaService.getEmpresas();
  }

  editEmpresa(id: string): void {
    this.router.navigate(['/empresas/edit', id]);
  }

  createEmpresa(): void {
    this.router.navigate(['/empresas/new']);
  }

  openImageUploader(empresaId: string): void {
    this.dialog.open(ImageBatchUploaderComponent, {
      width: '800px',
      data: { empresaId: empresaId }
    });
  }

  openProductImporter(empresaId: string): void {
    this.dialog.open(ProductImportComponent, {
      width: '800px',
      data: { empresaId: empresaId }
    });
  }

  deleteEmpresa(id: string): void {
    if (confirm('Are you sure you want to delete this company?')) {
      this.empresaService.deleteEmpresa(id).subscribe(() => {
        this.loadEmpresas(); // Refresh the list
      });
    }
  }
}