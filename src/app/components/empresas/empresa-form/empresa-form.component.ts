import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService, Empresa } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './empresa-form.component.html',
  styleUrl: './empresa-form.component.css'
})
export class EmpresaFormComponent implements OnInit {
  empresaForm: FormGroup;
  isEditMode = false;
  empresaId: string | null = null;

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
    });
  }

  ngOnInit(): void {
    this.empresaId = this.route.snapshot.paramMap.get('id');
    if (this.empresaId) {
      this.isEditMode = true;
      this.empresaService.getEmpresa(this.empresaId).subscribe(empresa => {
        this.empresaForm.patchValue(empresa);
      });
    }
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
