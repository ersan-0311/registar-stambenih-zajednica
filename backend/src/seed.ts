import 'dotenv/config';
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import StambenaZajednica from './models/StambenaZajednica';
import Metapodaci from './models/Metapodaci';
import { execSync } from 'child_process';

interface RawRow {
    OkrugNaziv1: string;
    OpstinaNaziv1: string;
    PoslovnoIme: string;
    Ulica: string;
    KucniBroj: string | number;
}

const seed = async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Povezan na bazu');

    const workbook = XLSX.readFile('data/registarstambenihzajednica-20260630.ods');
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
        throw new Error('Fajl nema nijedan sheet');
    }
      const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" nije pronađen u fajlu`);
    }
    const sirovi: RawRow[] = XLSX.utils.sheet_to_json(sheet);

    const mapirano = sirovi.map((red) => ({
        okrug: red.OkrugNaziv1,
        opstina: red.OpstinaNaziv1,
        poslovnoIme: red.PoslovnoIme,
        ulica: red.Ulica,
        kucniBroj: String(red.KucniBroj)
    }));

    const vidjeno = new Set<string>();
    const podaci = mapirano.filter((z) => {
        const kljuc = `${z.okrug}|${z.opstina}|${z.poslovnoIme}|${z.ulica}|${z.kucniBroj}`;
        if (vidjeno.has(kljuc)) return false;
        vidjeno.add(kljuc);
        return true;
    });

    await StambenaZajednica.deleteMany({});
    console.log('Stara kolekcija obrisana');

    await StambenaZajednica.insertMany(podaci);
    console.log(`Uneto ${podaci.length} zapisa (od ${mapirano.length} pre uklanjanja duplikata)`);


    await Metapodaci.deleteMany({});
    await Metapodaci.create({ datumUvoza: new Date() });
    console.log('Datum uvoza sačuvan');

    console.log('Pokrećem geokodiranje opština...');
    execSync('npx ts-node-dev --transpile-only src/geocode.ts', { stdio: 'inherit' });

    await mongoose.disconnect();
    console.log('Gotovo');
};

seed();