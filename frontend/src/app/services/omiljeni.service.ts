import { Injectable } from '@angular/core';

const KLJUC_U_LOCALSTORAGE = 'omiljene-zajednice';

@Injectable({
  providedIn: 'root'
})
export class OmiljeniService {

  getSveOmiljene(): string[] {
    const sacuvano = localStorage.getItem(KLJUC_U_LOCALSTORAGE);
    return sacuvano ? JSON.parse(sacuvano) : [];
  }

  jeOmiljena(id: string): boolean {
    return this.getSveOmiljene().includes(id);
  }

  prebaci(id: string): void {
    const trenutne = this.getSveOmiljene();

    if (trenutne.includes(id)) {
      const nove = trenutne.filter((sacuvaniId) => sacuvaniId !== id);
      this.sacuvaj(nove);
    } else {
      trenutne.push(id);
      this.sacuvaj(trenutne);
    }
  }

  private sacuvaj(lista: string[]): void {
    localStorage.setItem(KLJUC_U_LOCALSTORAGE, JSON.stringify(lista));
  }
}