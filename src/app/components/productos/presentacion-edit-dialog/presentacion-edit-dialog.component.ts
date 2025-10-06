import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

export interface PresentacionDialogData {
  nombre: string;
  precioventa: number;
  disponible: boolean;
}

@Component({
  selector: 'app-presentacion-edit-dialog',
  templateUrl: './presentacion-edit-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule
  ]
})
export class PresentacionEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PresentacionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PresentacionDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
