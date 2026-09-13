import 'dotenv/config';

import express from 'express';
import connectDB from './config/db';

import stambenaZajednicaRouter from './routers/stambenaZajednicaRouter';
import cors from 'cors';



const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
connectDB();


app.use('/api/stambene-zajednice', stambenaZajednicaRouter);

app.get('/', (req, res) => {
  res.send('Server radi');
});

app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
}); 