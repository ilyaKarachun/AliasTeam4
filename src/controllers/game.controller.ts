import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services/game.service';

class GameController {
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
  async getAllGames(req: Request, res: Response, next: NextFunction) {
    try {
      // const result = await gameService.getAllGames();
      // return res.status(200).json({ ...result });
    } catch (e) {
      next(e);
    }
  }
  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      // const result = await gameService.joinGame();

      return res.status(200).json({
        // message: `You've joined to the team ${result.team}. Your chat id - ${result.chatId}`,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new GameController();
