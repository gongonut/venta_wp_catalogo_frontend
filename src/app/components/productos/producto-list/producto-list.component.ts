import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../services/empresa.service';
import { Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  productos$: Observable<Producto[]> | undefined;
  empresaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.loadProducts(this.empresaId);
    }
  }

  loadProducts(empresaId: string): void {
    this.productos$ = this.empresaService.getProducts(empresaId);
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