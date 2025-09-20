import { Routes } from '@angular/router';
import { BotsComponent } from './components/bots/bots.component';
import { EmpresaListComponent } from './components/empresas/empresa-list/empresa-list.component';
import { EmpresaFormComponent } from './components/empresas/empresa-form/empresa-form.component';
import { HomeComponent } from './components/home/home.component';
import { ProductoListComponent } from './components/productos/producto-list/producto-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'bots', component: BotsComponent },
    { path: 'empresas', component: EmpresaListComponent },
    { path: 'empresas/new', component: EmpresaFormComponent },
    { path: 'empresas/edit/:id', component: EmpresaFormComponent },
    { path: 'empresas/:id/productos', component: ProductoListComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];