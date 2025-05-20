import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MkPlanner AI Backend is running 🚀');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
