import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/auth.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Veedor App Mailer Backend is running!');
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Mini-Backend de Correos corriendo en el puerto ${port}`);
});
