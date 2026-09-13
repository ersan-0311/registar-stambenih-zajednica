import { Routes } from '@angular/router';
import { PocetnaComponent } from './pages/pocetna/pocetna.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { PretragaComponent } from './pages/pretraga/pretraga.component';
import { DetaljiComponent } from './pages/detalji/detalji.component';
import { OmiljeniComponent } from './pages/omiljeni/omiljeni.component';

export const routes: Routes = [
  { path: '', component: PocetnaComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'pretraga', component: PretragaComponent },
  { path: 'detalji/:id', component: DetaljiComponent },
  { path: 'omiljeni', component: OmiljeniComponent}
];