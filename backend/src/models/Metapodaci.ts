import mongoose, { Schema, Document } from 'mongoose';

export interface IMetapodaci extends Document {
  datumUvoza: Date;
}

const metapodaciSchema = new Schema<IMetapodaci>({
  datumUvoza: { type: Date, required: true }
});

export default mongoose.model<IMetapodaci>('Metapodaci', metapodaciSchema);