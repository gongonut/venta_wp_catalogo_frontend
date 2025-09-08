import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Bienvenido al Panel de Administración</h1>
      <p class="text-lg mb-8">Selecciona una opción para comenzar:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 class="text-xl font-semibold mb-4">Gestión de Empresas</h2>
          <p class="text-gray-600 mb-4">Administra la información de tus empresas.</p>
          <a routerLink="/empresas" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ir a Empresas
          </a>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 class="text-xl font-semibold mb-4">Gestión de Bots</h2>
          <p class="text-gray-600 mb-4">Configura y monitorea tus bots de WhatsApp.</p>
          <a routerLink="/bots" class="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Ir a Bots
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
