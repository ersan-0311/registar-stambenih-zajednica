import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB konekcija uspostavljena');
  } catch (err) {
    console.error('Greška pri konekciji na MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;