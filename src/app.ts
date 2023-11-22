/* eslint-disable */
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import api from './router';
import cors from 'cors';
import errorHandlerMiddleWare from './middlewares/errorHandler.middleware';
import { createDatabase, dbName } from './database/database';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1', api);
app.use(errorHandlerMiddleWare);

app.get('/', (request: Request, response: Response) => {
  return response.json({
    status: 'express server is running',
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));

async function startApp() {
  try {
    await createDatabase(dbName);
  } catch (error) {
    console.error('Error:', error);
  }
}

import rootWordRecognition from '../src/helpers/rootWordRecognition';
const word = 'смелость';
const description = 'осмелиться ';
console.log(rootWordRecognition(word, description));
console.log(rootWordRecognition(word, 'осмкл5ился'));
console.log(rootWordRecognition(word, 'осёл'));

startApp();
