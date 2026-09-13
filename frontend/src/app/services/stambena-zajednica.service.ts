import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Statistika {
  ukupnoZajednica: number;
  ukupnoOpstina: number;
  datumUvoza: string | null;
}

export interface StambenaZajednica{
  _id: string;
  okrug: string;
  opstina: string; 
  poslovnoIme: string;
  ulica: string;
  kucniBroj: string;
  geografskaSirina?: number;
  geografskaDuzina?: number;
}

export interface StambeneZajedniceOdgovor{
  items: StambenaZajednica[];
  total: number;
  page: number; 
  pages: number;
}

export interface OpstinaSaBrojem{
  opstina: string;
  brojZajednica: number;
  geografskaSirina: number;
  geografskaDuzina: number;
}

@Injectable({
  providedIn: 'root'
})
export class StambenaZajednicaService {

  private baseUrl = 'http://localhost:5000/api/stambene-zajednice';

  constructor(private http: HttpClient) { }

  getAll(search?: string, opstine?: string[], page: number = 1):Observable<StambeneZajedniceOdgovor>{
    
    let url = `${this.baseUrl}?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (opstine && opstine.length > 0) {
      opstine.forEach((o) => (url += `&opstina=${encodeURIComponent(o)}`));
    }

    return this.http.get<StambeneZajedniceOdgovor>(url);

  }

  getOpstine(): Observable<{ items: OpstinaSaBrojem[] }>{
    return this.http.get<{ items: OpstinaSaBrojem[] }>(`${this.baseUrl}/opstine`);
  }

  getById(id: string): Observable<{ item: StambenaZajednica }> {
    return this.http.get<{ item: StambenaZajednica }>(`${this.baseUrl}/${id}`);
  }


  getStatistiku(): Observable<Statistika> {
    return this.http.get<Statistika>(`${this.baseUrl}/statistika`);
  }


}
