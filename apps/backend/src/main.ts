import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { prismaClient } from './utils/database';
import { redisClient } from './utils/redisClient';
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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/sprint', sprintRoutes);
app.use('/userStory', userStoryRoutes);
app.use('/auth', authenticationRoutes);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

redisClient
  .on('error', (error) => console.error(error))
  .on('connect', () => console.log('Connected to Redis'))
  .connect();

prismaClient
  .$connect()
  .then(() => console.log('Connected to the database'))
  .catch(console.error);

server.on('error', console.error);
