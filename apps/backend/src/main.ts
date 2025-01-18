import express from 'express';
import * as path from 'path';
import { prismaClient } from './utils/database';
import cookieParser from 'cookie-parser';
import { userRoutes } from './routes/user.routes';
import { taskRoutes } from './routes/task.routes';
import { sprintRoutes } from './routes/sprint.routes';
import { userStoryRoutes } from './routes/userStory.routes';
import { authenticationRoutes } from './routes/authentication.routes';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoutes)
app.use('/task', taskRoutes)
app.use('/sprint', sprintRoutes)
app.use('/userStory', userStoryRoutes)
app.use('/auth', authenticationRoutes)

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
