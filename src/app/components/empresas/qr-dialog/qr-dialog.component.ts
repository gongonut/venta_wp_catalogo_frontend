import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Bot, BotService } from '../../../services/bot.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface QrDialogData {
  empresa: {
    code: string;
    nombre: string;
  };
}

@Component({
  selector: 'app-qr-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    QRCodeComponent,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.css']
})
export class QrDialogComponent implements OnInit {
  public activeBots$!: Observable<Bot[]>;
  public selectedBotNumber: string | null = null;
  public qrData: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<QrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QrDialogData,
    private botService: BotService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activeBots$ = this.botService.getBots().pipe(
      map(bots => bots.filter(bot => bot.status === 'active'))
    );
  }

  onBotSelectionChange(): void {
    if (this.selectedBotNumber) {
      this.qrData = `https://wa.me/${this.selectedBotNumber}?text=${this.data.empresa.nombre}`;
    } else {
      this.qrData = null;
    }
  }

  copyToClipboard() {
    if (!this.qrData) return;
    navigator.clipboard.writeText(this.qrData).then(() => {
      this._snackBar.open('¡Copiado al portapapeles!', 'Cerrar', {
        duration: 2000,
      });
    }).catch(err => {
      console.error('Error al copiar texto: ', err);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}