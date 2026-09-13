import { Injector, runInInjectionContext, afterNextRender, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StambenaZajednicaService, StambenaZajednica } from '../../services/stambena-zajednica.service';
import { OmiljeniService } from '../../services/omiljeni.service';
import { Location } from '@angular/common';
import * as L from 'leaflet'

@Component({
  selector: 'app-detalji',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalji.component.html',
  styleUrl: './detalji.component.css'
})
export class DetaljiComponent implements OnInit {
  zajednica: StambenaZajednica | null = null;
  ucitavanje = true;
  greska = '';
  id = '';

  constructor(
    private route: ActivatedRoute,
    private zajednicaService: StambenaZajednicaService,
    private omiljeniService: OmiljeniService,
    private location: Location,
    private injector: Injector
  ) {}

  

  vratiSeNazad(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.greska = 'Nedostaje ID zajednice';
      this.ucitavanje = false;
      return;
    }

    this.id = id;

    this.zajednicaService.getById(id).subscribe({
      next: (odgovor) => {
        this.zajednica = odgovor.item;
        this.ucitavanje = false;

        runInInjectionContext(this.injector, () => {
          afterNextRender(() => this.inicijalizujMapu());
        });
      },
      error: (err) => {
        this.greska = 'Стамбена заједница није пронађена';
        this.ucitavanje = false;
      }
    });
  }


  private inicijalizujMapu(): void {
    if (!this.zajednica) return;

    if (this.zajednica.geografskaSirina === undefined || this.zajednica.geografskaDuzina === undefined) return;

    const mapa = L.map('mini-mapa').setView(
      [this.zajednica.geografskaSirina, this.zajednica.geografskaDuzina],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    L.marker([this.zajednica.geografskaSirina, this.zajednica.geografskaDuzina]).addTo(mapa);
  }


  jeOmiljena(): boolean {
    return this.omiljeniService.jeOmiljena(this.id);
  }

  prebaciOmiljenu(): void {
    this.omiljeniService.prebaci(this.id);
  }


  linkKopiran = false;

  kopirajLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.linkKopiran = true;
      setTimeout(() => (this.linkKopiran = false), 2000);
    });
  }
}