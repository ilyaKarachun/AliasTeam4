import express from 'express';
import { config } from 'dotenv';
import api from './router';
import errorHandlerMiddleWare from './middlewares/errorHandler.middleware';

config();
const app = express();

app.use(express.json());
app.use('/api/v1', api);
app.use(errorHandlerMiddleWare);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Running on port ${process.env.PORT}`),
);
