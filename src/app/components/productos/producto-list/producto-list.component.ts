import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Producto } from '../../../models/producto.model';
import { Empresa } from '../../../models/empresa.model';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PresentacionEditDialogComponent, PresentacionDialogData } from '../presentacion-edit-dialog/presentacion-edit-dialog.component';
import { ProductImportComponent } from '../../product-import/product-import.component';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  empresa$: Observable<Empresa> | undefined;
  empresaId: string | null = null;
  editingProduct: Partial<Producto> | null = null;
  productEditForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.productEditForm = this.fb.group({
      sku: ['', Validators.required],
      nombreCorto: ['', Validators.required],
      descripcion: [''],
      precioVenta: [0, Validators.required],
      categoria: [''],
      fotos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.loadEmpresa(this.empresaId);
    }
  }

  loadEmpresa(empresaId: string): void {
    this.empresa$ = this.empresaService.getEmpresa(empresaId);
  }

  createProducto(): void {
    this.editingProduct = {}; // Empty product
    this.productEditForm.reset({
      precioVenta: 0,
      fotos: []
    });
    this.fotos.clear();
    this.productEditForm.get('sku')?.enable();
  }

  openProductImporter(): void {
    if (this.empresaId) {
      const dialogRef = this.dialog.open(ProductImportComponent, {
        width: '800px',
        data: { empresaId: this.empresaId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.empresaId) {
          this.loadEmpresa(this.empresaId);
        }
      });
    }
  }

  toggleEdit(producto: Producto): void {
    if (this.editingProduct?.sku === producto.sku) {
      this.cancelEdit();
    } else {
      this.editingProduct = producto;
      this.productEditForm.reset(producto);
      this.fotos.clear();
      if (producto.fotos) {
        producto.fotos.forEach(foto => this.addFoto(foto));
      }
      this.productEditForm.get('sku')?.disable();
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  get fotos(): FormArray {
    return this.productEditForm.get('fotos') as FormArray;
  }

  addFoto(fotoUrl: string = ''): void {
    if (this.fotos.length < 5) {
      this.fotos.push(this.fb.control(fotoUrl));
    }
  }

  removeFoto(index: number): void {
    this.fotos.removeAt(index);
  }

  saveProduct(): void {
    if (!this.productEditForm.valid || !this.empresaId) {
      return;
    }

    const productData = this.productEditForm.getRawValue();

    if (this.editingProduct && this.editingProduct.sku) {
      // Update existing product
      this.empresaService.updateProduct(this.empresaId, this.editingProduct.sku, productData).subscribe(() => {
        this.cancelEdit();
        if (this.empresaId) {
          this.loadEmpresa(this.empresaId);
        }
      });
    } else {
      // Create new product
      this.empresaService.createProduct(this.empresaId, productData).subscribe(() => {
        this.cancelEdit();
        if (this.empresaId) {
          this.loadEmpresa(this.empresaId);
        }
      });
    }
  }

  openEditDialog(producto: Producto, presentationKey: string): void {
    const presentacion = producto.presentacion?.[presentationKey];
    if (!presentacion) return;

    const dialogRef = this.dialog.open<PresentacionEditDialogComponent, PresentacionDialogData, PresentacionDialogData>(
      PresentacionEditDialogComponent,
      {
        data: {
          nombre: presentationKey,
          precioventa: presentacion.precioventa,
          disponible: presentacion.disponible
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.empresaId && producto.presentacion) {
        const updatedPresentation = {
          ...producto.presentacion,
          [presentationKey]: {
            precioventa: result.precioventa,
            disponible: result.disponible
          }
        };

        const updatedProduct: Partial<Producto> = {
          ...producto,
          presentacion: updatedPresentation
        };

        this.empresaService.updateProduct(this.empresaId, producto.sku, updatedProduct).subscribe(() => {
          if(this.empresaId)
            this.loadEmpresa(this.empresaId);
        });
      }
    });
  }

  agregarPresentacion(producto: Producto): void {
    const newPresentationName = prompt('Ingrese el nombre de la nueva presentación:');
    if (newPresentationName && this.empresaId) {
        const dialogRef = this.dialog.open<PresentacionEditDialogComponent, PresentacionDialogData, PresentacionDialogData>(
            PresentacionEditDialogComponent,
            {
                data: {
                    nombre: newPresentationName,
                    precioventa: 0,
                    disponible: true
                }
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.empresaId) {
                const updatedPresentation = {
                    ...(producto.presentacion || {}),
                    [newPresentationName]: {
                        precioventa: result.precioventa,
                        disponible: result.disponible
                    }
                };

                const updatedProduct: Partial<Producto> = {
                    ...producto,
                    presentacion: updatedPresentation
                };

                this.empresaService.updateProduct(this.empresaId, producto.sku, updatedProduct).subscribe(() => {
                    if (this.empresaId) {
                        this.loadEmpresa(this.empresaId);
                    }
                });
            }
        });
    }
  }

  eliminarPresentacion(producto: Producto, key: string): void {
    if (confirm(`¿Está seguro de que desea eliminar la presentación "${key}"?`)) {
        if (this.empresaId && producto.presentacion) {
            const updatedPresentacion = { ...producto.presentacion };
            delete updatedPresentacion[key];

            const updatedProduct: Partial<Producto> = {
                ...producto,
                presentacion: updatedPresentacion
            };

            this.empresaService.updateProduct(this.empresaId, producto.sku, updatedProduct).subscribe(() => {
                if (this.empresaId) {
                    this.loadEmpresa(this.empresaId);
                }
            });
        }
    }
  }

  editarPrecioBase(producto: Producto): void {
    const nuevoPrecioStr = prompt('Ingrese el nuevo precio base:', producto.precioVenta.toString());
    if (nuevoPrecioStr && this.empresaId) {
      const nuevoPrecio = parseFloat(nuevoPrecioStr);
      if (!isNaN(nuevoPrecio)) {
        const updatedProduct: Partial<Producto> = {
          precioVenta: nuevoPrecio
        };

        this.empresaService.updateProduct(this.empresaId, producto.sku, updatedProduct).subscribe(() => {
          if (this.empresaId) {
            this.loadEmpresa(this.empresaId);
          }
        });
      }
    }
  }

  eliminarProducto(producto: Producto): void {
    if (confirm(`¿Está seguro de que desea eliminar el producto "${producto.nombreCorto}"?`)) {
      if (this.empresaId) {
        this.empresaService.deleteProduct(this.empresaId, producto.sku).subscribe(() => {
          if (this.empresaId) {
            this.loadEmpresa(this.empresaId);
          }
        });
      }
    }
  }

  getKeys(obj: object | undefined): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatPrice(producto: Producto): string {
    if (producto.presentacion) {
      const prices = Object.values(producto.presentacion)
        .filter(p => p.disponible && p.precioventa)
        .map(p => p.precioventa);

      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
          return `${minPrice.toFixed(2)}`;
        } else {
          return `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
        }
      }
    }
    
    return `${producto.precioVenta.toFixed(2)}`;
  }
}
