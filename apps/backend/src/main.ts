import express from 'express';
import * as path from 'path';
import { prismaClient } from './utils/database';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

prismaClient
  .$connect()
  .then(() => console.log('Connected to the database'))
  .catch(console.error);

server.on('error', console.error);
