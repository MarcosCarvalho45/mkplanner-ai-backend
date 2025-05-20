import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/db';
import authRoutes from './routes/auth.routes';

// configuracoes
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// conecxoes
app.use(cors());
app.use(express.json());

// rotas do sistema
app.use('/auth', authRoutes);


// conecxao com DB
connectDatabase();


// rodando o servidor
app.get('/', (req, res) => {
  res.send('MkPlanner AI Backend is running 🚀');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
