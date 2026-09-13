import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { StambenaZajednicaService, StambenaZajednica } from '../../services/stambena-zajednica.service';
import { OmiljeniService } from '../../services/omiljeni.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-omiljeni',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './omiljeni.component.html',
  styleUrl: './omiljeni.component.css'
})
export class OmiljeniComponent implements OnInit {
  zajednice: StambenaZajednica[] = [];
  ucitavanje = true;

  constructor(
    private zajednicaService: StambenaZajednicaService,
    private omiljeniService: OmiljeniService
  ) {}

  ngOnInit(): void {
    const idjevi = this.omiljeniService.getSveOmiljene();

    if (idjevi.length === 0) {
      this.ucitavanje = false;
      return;
    }


    const pozivi = idjevi.map((id) =>
      this.zajednicaService.getById(id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(pozivi).subscribe({
      next: (odgovori) => {
        const vazeci = odgovori.filter((o) => o !== null);
        this.zajednice = vazeci.map((o) => o!.item);

        const vazeciIdjevi = this.zajednice.map((z) => z._id);
        idjevi
          .filter((id) => !vazeciIdjevi.includes(id))
          .forEach((id) => this.omiljeniService.prebaci(id));

        this.ucitavanje = false;
      },
      error: () => {
        this.ucitavanje = false;
      }
    });
  }

  ukloni(id: string): void {
    this.omiljeniService.prebaci(id);
    this.zajednice = this.zajednice.filter((z) => z._id !== id);
  }
}