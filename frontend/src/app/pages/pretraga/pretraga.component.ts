import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StambenaZajednicaService, StambenaZajednica, OpstinaSaBrojem } from '../../services/stambena-zajednica.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pretraga',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pretraga.component.html',
  styleUrl: './pretraga.component.css'
})
export class PretragaComponent implements OnInit {
  pretragaTekst = '';
  izabraneOpstine: string[] = [];

  opstine: OpstinaSaBrojem[] = [];
  rezultati: StambenaZajednica[] = [];

  ukupno = 0;
  trenutnaStranica = 1;
  ukupnoStranica = 0;

  ucitavanje = true;
  greska = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zajednicaService: StambenaZajednicaService) {}

  ngOnInit(): void {
    const opstineIzUrl = this.route.snapshot.queryParamMap.getAll('opstina');
    if (opstineIzUrl.length > 0) {
      this.izabraneOpstine = opstineIzUrl;
    }

    const pretragaIzUrl = this.route.snapshot.queryParamMap.get('search');
    if (pretragaIzUrl) {
      this.pretragaTekst = pretragaIzUrl;
    }

    this.ucitajOpstine();
    this.pretrazi();
  }

  private ucitajOpstine(): void {
    this.zajednicaService.getOpstine().subscribe({
      next: (odgovor) => {
        this.opstine = odgovor.items.sort((a, b) => a.opstina.localeCompare(b.opstina));
      },
      error: (err) => console.error('Greška pri učitavanju opština', err)
    });
  }

  pretrazi(): void {
    this.trenutnaStranica = 1;
    this.azurirajUrl();
    this.ucitajRezultate();
  }

  private azurirajUrl(): void {
    const queryParams: any = {};
    if (this.pretragaTekst) queryParams.search = this.pretragaTekst;
    if (this.izabraneOpstine.length > 0) queryParams.opstina = this.izabraneOpstine;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }

  izaberiOpstinu(opstina: string): void {
    if (this.izabraneOpstine.includes(opstina)) {
      this.izabraneOpstine = this.izabraneOpstine.filter((o) => o !== opstina);
    } else {
      this.izabraneOpstine = [...this.izabraneOpstine, opstina];
    }
    this.pretrazi();
  }

  idiNaStranicu(broj: number): void {
    this.trenutnaStranica = broj;
    this.ucitajRezultate();
  }

  private ucitajRezultate(): void {
    this.ucitavanje = true;
    this.greska = '';

    this.zajednicaService.getAll(this.pretragaTekst, this.izabraneOpstine, this.trenutnaStranica).subscribe({
      next: (odgovor) => {
        this.rezultati = odgovor.items;
        this.ukupno = odgovor.total;
        this.ukupnoStranica = odgovor.pages;
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju podataka';
        this.ucitavanje = false;
      }
    });
  }
}