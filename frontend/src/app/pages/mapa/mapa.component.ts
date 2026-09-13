import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { StambenaZajednicaService, OpstinaSaBrojem } from '../../services/stambena-zajednica.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit {
  private mapa!: L.Map;

  constructor(private zajednicaService: StambenaZajednicaService) {}

  ngAfterViewInit(): void {
    this.inicijalizujMapu();
    this.ucitajOpstine();
  }

  private inicijalizujMapu(): void {
    this.mapa = L.map('mapa-kontejner').setView([44.0, 21.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapa);
  }

  private ucitajOpstine(): void {
    this.zajednicaService.getOpstine().subscribe({
      next: (odgovor) => {
        odgovor.items.forEach((opstina) => this.dodajMarker(opstina));
      },
      error: (err) => {
        console.error('Greška pri učitavanju opština', err);
      }
    });
  }

  private dodajMarker(opstina: OpstinaSaBrojem): void {
    const marker = L.circleMarker([opstina.geografskaSirina, opstina.geografskaDuzina], {
      radius: Math.min(20, 5 + opstina.brojZajednica / 100),
      color: '#3a6ea5',
      fillColor: '#3a6ea5',
      fillOpacity: 0.5
    });

    const urlZaPretragu = `/pretraga?opstina=${encodeURIComponent(opstina.opstina)}`;
    marker.bindPopup(`
      <strong>${opstina.opstina}</strong><br>
      ${opstina.brojZajednica} стамбених заједница<br>
      <a href="${urlZaPretragu}">Прикажи у претрази</a>
    `);
    marker.addTo(this.mapa);
  }
}