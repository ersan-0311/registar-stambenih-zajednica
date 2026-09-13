import mongoose, { Schema, Document } from 'mongoose';

export interface IStambenaZajednica extends Document {
  okrug: string;
  opstina: string;
  poslovnoIme: string;
  ulica: string;
  kucniBroj: string;
  geografskaSirina?: number;
  geografskaDuzina?: number;
}

const stambenaZajednicaSchema = new Schema<IStambenaZajednica>({
  okrug: { type: String, required: true, trim: true },
  opstina: { type: String, required: true, trim: true, index: true },
  poslovnoIme: { type: String, required: true, trim: true },
  ulica: { type: String, required: true, trim: true },
  kucniBroj: { type: String, required: true, trim: true },
  geografskaSirina: { type: Number },
  geografskaDuzina: { type: Number }
});

stambenaZajednicaSchema.index({ poslovnoIme: 'text', opstina: 'text', ulica: 'text' });

export default mongoose.model<IStambenaZajednica>('StambenaZajednica', stambenaZajednicaSchema);