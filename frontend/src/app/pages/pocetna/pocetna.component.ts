import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StambenaZajednicaService, Statistika } from '../../services/stambena-zajednica.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.css'
})
export class PocetnaComponent implements OnInit {
  pretragaTekst = '';
  statistika: Statistika | null = null;

  constructor(
    private zajednicaService: StambenaZajednicaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.zajednicaService.getStatistiku().subscribe({
      next: (odgovor) => (this.statistika = odgovor),
      error: (err) => console.error('Greška pri učitavanju statistike', err)
    });
  }

  pretrazi(): void {
    if (this.pretragaTekst) {
      this.router.navigate(['/pretraga'], { queryParams: { search: this.pretragaTekst } });
    } else {
      this.router.navigate(['/pretraga']);
    }
  }
} 