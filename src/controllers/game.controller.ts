import { gameService } from '../services/game.service';

class GameController {
  gamesConnections: any;

  constructor() {
    this.gamesConnections = {};
  }

  chat = async (ws, req) => {
    try {
      const gameId = req.params.id;
      const userInfo = req?.userInfo?.user;

      if (!gameId) {
        ws.send('System: game id was not provided!');
        ws.close();
        ws.terminate();
        return;
      }

      await gameService.establishGameConnection(userInfo, gameId, ws);
    } catch (e) {
      console.log('e', e);
      ws.send(`${e}`);
      ws.close();
      ws.terminate();
    }
  };

  async create(req, res, next) {
    try {
      const result = await gameService.create(req.userInfo.user);
      return res.status(200).json({ ...result });
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await gameService.getAll();
      return res.status(200).json({ ...result });
    } catch (e) {
      next(e);
    }
  }
  async join(req, res, next) {
    try {
      const user_id = req.userInfo.user.id;
      const game_id = req.params.gameId;
      const teamNumber = req.query.team;

      const result = await gameService.join({
        user_id: user_id,
        game_id: game_id,
        number: teamNumber,
      });

      return res.status(200).json({
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }

  async getGameById(req, res, next) {
    try {
      const game_id = req.params.gameId;

      const result = await gameService.getGameById(game_id);

      return res.status(200).json({
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default new GameController();
