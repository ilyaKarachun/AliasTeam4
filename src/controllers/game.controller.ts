import { Request, Response, NextFunction } from 'express';

class GameController {
  async createGame(req: Request, res: Response, next: NextFunction) {
    try {
      //   create createGame method
      //   await gameService.createGame(req.body);
      return res.status(201).json({ message: 'Game successfully created.' });
    } catch (e) {
      return next(e);
    }
  }
  async getAllGames(req: Request, res: Response, next: NextFunction) {
    try {
      let result;
      //   create getAllGames method
      //   const result = await gameService.getAllGames();
      return res.status(201).json({ ...result });
    } catch (e) {
      return next(e);
    }
  }
  async getWinner(req: Request, res: Response, next: NextFunction) {
    try {
      let result;
      //   create getWinner method
      //   const result = await gameService.getWinner();
      return res
        .status(200)
        .json(`Team number ${result} is the winner! Congradulations!!!`);
    } catch (e) {
      return next(e);
    }
  }
  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      let result;
      // create joinGame method
      // const result = await gameService.joinGame(req.body,req.params.gameId);
      return res
        .status(200)
        .json({ message: `You've joined the team ${result}` });
    } catch (e) {
      return next(e);
    }
  }
  async joinTeamChat(req: Request, res: Response, next: NextFunction) {
    try {
      // create joinTeamChat method
      // await gameService.joinTeamChat(req.body,req.params.gameId);
      return res.status(200).json({
        message: 'Player in the chat.',
      });
    } catch (e) {
      return next(e);
    }
  }
  async deleteGame(req: Request, res: Response, next: NextFunction) {
    try {
      // create deleteGame method
      // await gameService.deleteGame(req.params.gameId);
      return res.status(204);
    } catch (e) {
      return next(e);
    }
  }
}

export default new GameController();
