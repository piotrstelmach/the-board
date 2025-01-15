import express from 'express';
import * as path from 'path';
import { prismaClient } from './utils/database';
import { userRoutes } from './routes/user.routes';
import { taskRoutes } from './routes/task.routes';
import { sprintRoutes } from './routes/sprint.routes';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/user', userRoutes)
app.use('/task', taskRoutes)
app.use('/sprint', sprintRoutes)

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
