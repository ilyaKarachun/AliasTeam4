/* eslint-disable */
import express, { Request, Response, request } from 'express';
import dotenv from 'dotenv';
import api from './router';
import cors from 'cors';
import errorHandlerMiddleWare from './middlewares/errorHandler.middleware';
import { createDatabase, dbName } from './database/database';
import expressWs from 'express-ws';
import { create } from 'express-handlebars';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = expressWs(express()).app;
const port = process.env.PORT || 3000;
import { mountGameRouter } from './router/games.router';
import * as path from 'path';
import clientAuthMiddleware from './middlewares/clientAuth.middleware';
import { gameService } from './services/game.service';
import { userService } from './services/user.service';

/**
 * Workaround to init router
 * before other router,
 * otherwise we will get an error
 * https://stackoverflow.com/questions/75707601/typeerror-router-ws-is-not-a-function-express-ws-typescript
 */
mountGameRouter();

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/v1', api);
app.use(errorHandlerMiddleWare);
app.use(express.static('public'));

const hbs = create({
  partialsDir: [
    'shared/templates/',
    'views/partials/',
    path.join(__dirname, 'views/partials'),
  ],
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
  });
});

app.get('/chat/:id', (req, res) => {
  res.render('chat', {});
});

app.get('/games/:id', clientAuthMiddleware, async (req, res) => {
  const gameInfo = await gameService.getGameById(req.params.id);

  if (!gameInfo.game) {
    return res.render('404');
  }

  const isUserInGame =
    gameInfo?.game?.team_1.includes(req.userInfo.user.id) ||
    gameInfo?.game?.team_2.includes(req.userInfo.user.id);

  if (isUserInGame) {
    res.redirect(`/chat/${req.params.id}`);
  }

  return res.render('game-single', {
    gameInfo: gameInfo.game,
  });
});

app.get('/profile', clientAuthMiddleware, async (req, res) => {
  const data = req.userInfo.user;
  let game;
  console.log('data: ', data);
  if (data.statistic.length > 0) {
    game = await Promise.all(
      data.statistic.map(async (el) => {
        return await gameService.getGameById(el);
      }),
    );
  }
  return res.render('profile', {
    // title: 'Profile',
    renderStatus: 'fsdf',
    // data: data,
    // game: game,
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'login',
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    title: 'Registration',
  });
});

app.get('/rules', (req, res) => {
  res.render('rules', {
    title: 'Rules',
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
