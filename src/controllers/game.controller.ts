import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services/game.service';

class GameController {
  gamesConnections: any;

  constructor() {
    this.gamesConnections = {};
  }

  chat = (ws, req) => {
    const gameId = req.params.id;
    const userId = req.query.user;

    if (!this.gamesConnections?.[gameId]) {
      this.gamesConnections[gameId] = {};
    }
    this.gamesConnections[gameId][userId] = ws;

    Object.values(this.gamesConnections[gameId]).forEach((conn) => {
      (conn as any).send(
        `User with id ${userId} was connected to game with id ${gameId}`,
      );
    });

    ws.on('message', (msg) => {
      const usersToSend = this.gamesConnections[gameId];
      Object.values(usersToSend).forEach((conn) => {
        (conn as any).send(`user-${userId} - ${msg}`);
      });
    });
  };

  async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.createGame({
        userId: req.params.userId,
      });

      return res.status(200).json({ userID: result });
    } catch (e) {
      next(e);
    }
  }
}

export default new GameController();