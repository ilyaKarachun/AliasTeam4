/* eslint-disable */
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import api from './router';
import cors from 'cors';
import errorHandlerMiddleWare from './middlewares/errorHandler.middleware';
import { createDatabase, dbName } from './database/database';
import expressWs from 'express-ws';
import { create } from 'express-handlebars';

dotenv.config();
const app = expressWs(express()).app;
const port = process.env.PORT || 3000;
import { mountGameRouter } from './router/games.router';
import * as path from "path";

/**
 * Workaround to init router
 * before other router,
 * otherwise we will get an error
 * https://stackoverflow.com/questions/75707601/typeerror-router-ws-is-not-a-function-express-ws-typescript
 */
mountGameRouter();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1', api);
app.use(errorHandlerMiddleWare);

const hbs = create({
  // helpers,
 
   // Uses multiple partials dirs, templates in "shared/templates/" are shared
   // with the client-side of the app (see below).
   partialsDir: [
     "shared/templates/",
     "views/partials/",
   ],
 });
 app.engine('handlebars', hbs.engine);
 app.set('view engine', 'handlebars');
 app.set("views", path.resolve(__dirname, "./views"));
 
 
 app.get("/test", (req, res) => {
   res.render("home", {
     title: "Home",
   });
 });

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

startApp();
