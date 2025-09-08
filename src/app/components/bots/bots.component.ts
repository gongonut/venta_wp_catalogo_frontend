import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotService, Bot } from '../../services/bot.service';
import { Socket } from 'ngx-socket-io';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-bots',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QRCodeComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.css']
})
export class BotsComponent implements OnInit {
  bots: Bot[] = [];
  newBotName = '';
  showQrCode = false;
  qrCodeData = '';

  constructor(private botService: BotService, private socket: Socket) {}

  ngOnInit() {
    this.loadBots();
  }

  loadBots() {
    this.botService.getBots().subscribe(bots => {
      this.bots = bots;
      this.bots.forEach(bot => this.listenToBotEvents(bot));
    });
  }

  listenToBotEvents(bot: Bot) {
    this.socket.fromEvent<string>(`qr:${bot.sessionId}`).subscribe(qr => {
      bot.qr = qr;
      bot.status = 'pairing';
    });
    this.socket.fromEvent<string>(`status:${bot.sessionId}`).subscribe(status => {
      bot.status = status as any;
    });
  }

  createBot() {
    if (this.newBotName) {
      this.botService.createBot(this.newBotName).subscribe(newBot => {
        this.bots.push(newBot);
        this.listenToBotEvents(newBot);
        this.newBotName = '';
      });
    }
  }

  deleteBot(id: string) {
    this.botService.deleteBot(id).subscribe(() => {
      this.bots = this.bots.filter(b => b._id !== id);
    });
  }

  activateBot(id: string) {
    this.botService.activateBot(id).subscribe(updatedBot => {
      const index = this.bots.findIndex(b => b._id === id);
      if (index !== -1) {
        this.bots[index] = updatedBot;
      }
    });
  }

  inactivateBot(id: string) {
    this.botService.inactivateBot(id).subscribe(updatedBot => {
      const index = this.bots.findIndex(b => b._id === id);
      if (index !== -1) {
        this.bots[index] = updatedBot;
      }
    });
  }

  refreshBotStatus(bot: Bot) {
    this.botService.getBot(bot._id).subscribe(updatedBot => {
      const index = this.bots.findIndex(b => b._id === bot._id);
      if (index !== -1) {
        this.bots[index] = updatedBot;
      }
    });
  }
}
