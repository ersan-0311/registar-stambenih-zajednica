import 'dotenv/config';
import mongoose from 'mongoose';
import StambenaZajednica from './models/StambenaZajednica';

interface NominatimRezultat {
  lat: string;
  lon: string;
}

interface OpstinaOkrug {
  opstina: string;
  okrug: string;
}

const cekaj = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pozoviNominatim = async (upit: string): Promise<{ lat: number; lon: number } | null> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(upit)}&format=json&limit=1&countrycodes=rs`;

  const odgovor = await fetch(url, {
    headers: {
      'User-Agent': 'RegistarStambenihZajednicaDiplomskiRad/1.0 (ersan.smailovic@gmail.com)'
    }
  });

  const podaci: NominatimRezultat[] = await odgovor.json();
  const prviRezultat = podaci[0];

  if (!prviRezultat) {
    return null;
  }

  return { lat: Number(prviRezultat.lat), lon: Number(prviRezultat.lon) };
};

const geokodirajOpstinu = async (opstina: string, okrug: string): Promise<{ lat: number; lon: number } | null> => {
  // Prvo probaj sa okrugom kao kontekstom (razdvaja istoimena mesta, npr. Sopot kod Beograda vs. selo Sopot kod Pirota)
  const preciznijiUpit = `${opstina}, ${okrug}, Србија`;
  const rezultat = await pozoviNominatim(preciznijiUpit);

  if (rezultat) {
    return rezultat;
  }

  // Ako precizniji upit ne nadje nista, probaj bez okruga kao rezervnu opciju
  await cekaj(1100);
  return pozoviNominatim(`${opstina}, Србија`);
};

const geokodirajSve = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Povezan na bazu');

  const parovi: OpstinaOkrug[] = await StambenaZajednica.aggregate([
    { $group: { _id: { opstina: '$opstina', okrug: '$okrug' } } },
    { $project: { _id: 0, opstina: '$_id.opstina', okrug: '$_id.okrug' } }
  ]);

  console.log(`Geokodiram ${parovi.length} opština...`);

  let uspesno = 0;
  const neuspesno: string[] = [];

  for (let i = 0; i < parovi.length; i++) {
    const par = parovi[i];
    if (!par) continue;

    const rezultat = await geokodirajOpstinu(par.opstina, par.okrug);

    if (rezultat) {
      await StambenaZajednica.updateMany(
        { opstina: par.opstina },
        { geografskaSirina: rezultat.lat, geografskaDuzina: rezultat.lon }
      );
      uspesno++;
      console.log(`[${i + 1}/${parovi.length}] ${par.opstina} (${par.okrug}) -> ${rezultat.lat}, ${rezultat.lon}`);
    } else {
      neuspesno.push(par.opstina);
      console.log(`[${i + 1}/${parovi.length}] ${par.opstina} -> NIJE PRONAĐENO`);
    }

    await cekaj(1100);
  }

  console.log(`\nGotovo. Uspešno: ${uspesno}, neuspešno: ${neuspesno.length}`);
  if (neuspesno.length > 0) {
    console.log('Opštine bez koordinata:', neuspesno);
  }

  await mongoose.disconnect();
};

geokodirajSve();