import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// routes
import orderRoute from './routes/orderRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/order/', orderRoute);

// production build servering
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Dev Finder api is running!');
  });
}

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${3000}`);
});
