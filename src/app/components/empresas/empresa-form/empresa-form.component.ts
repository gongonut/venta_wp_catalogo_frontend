import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './empresa-form.component.html',
  styleUrl: './empresa-form.component.css'
})
export class EmpresaFormComponent implements OnInit {
  empresaForm: FormGroup;
  isEditMode = false;
  empresaId: string | null = null;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.empresaForm = this.fb.group({
      code: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: [''],
      whatsApp: ['', Validators.required],
      email: ['', Validators.email],
      direccion: [''],
      saludoBienvenida: [''],
      saludoDespedida: [''],
      categorias: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.isEditMode = true;
      this.empresaService.getEmpresa(this.empresaId).subscribe(empresa => {
        this.empresaForm.patchValue(empresa);
        if (empresa.categorias) {
          const categoriaFGs = empresa.categorias.map(categoria => this.fb.control(categoria));
          this.empresaForm.setControl('categorias', this.fb.array(categoriaFGs));
        }
      });
    }
  }

  get categorias(): FormArray {
    return this.empresaForm.get('categorias') as FormArray;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.categorias.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }

  remove(index: number): void {
    this.categorias.removeAt(index);
  }

  saveEmpresa(): void {
    if (this.empresaForm.valid) {
      const empresaData = this.empresaForm.value;
      if (this.isEditMode && this.empresaId) {
        this.empresaService.updateEmpresa(this.empresaId, empresaData).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      } else {
        this.empresaService.createEmpresa(empresaData).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/empresas']);
  }
}
