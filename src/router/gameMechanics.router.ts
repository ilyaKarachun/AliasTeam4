import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import GameMechanicsController from '../controllers/gameMechanics.controllers';
const router = Router();
const gameMechanicsController = new GameMechanicsController();

// router.put(
//   '/game/mechanic/start/:id',
//   authMiddleware,
//   gameMechanicsController.startGame,
// ); //params gameId: str

// router.put(
//   '/game/mechanic',
//   authMiddleware,
//   gameMechanicsController.pointMessage,
// ); //body: gameId: str, messageContent: str

router.put(
  '/game/mechanic/new-word/:id',
  authMiddleware,
  gameMechanicsController.newWord,
); //params gameId: str

router.put(
  '/game/mechanic/description',
  authMiddleware,
  gameMechanicsController.validateDescription,
); //body gameId: str, description: string - react on typing

router.put(
  '/game/mechanic/result/:id',
  authMiddleware,
  gameMechanicsController.scoreCounting,
); //params: gameId: str
