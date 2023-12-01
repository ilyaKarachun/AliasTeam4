import HttpException from '../exceptions/httpException';
import ValidationException from '../exceptions/validationException';
import { validateObject } from '../helpers/validation';
import { gameService } from '../services/game.service';

class GameController {
  gamesConnections: any;

  constructor() {
    this.gamesConnections = {};
  }

  chat = async (ws, req) => {
    try {
      const gameId = req.params.id;
      const userToken = req?.query?.token;

      if (!userToken) {
        throw new HttpException(401, 'You should authorize firstly!');
      }

      if (!gameId) {
        ws.send('System: game id was not provided!');
        ws.close();
        ws.terminate();
        return;
      }

      await gameService.establishGameConnection(userToken, gameId, ws);
    } catch (e) {
      console.log('e', e);
      ws.send(`${e}`);
      ws.close();
      ws.terminate();
    }
  };

  async create(req, res, next) {
    try {
      const body = req.body;
      const errors = validateObject(body, {
        name: {
          required: true,
          type: 'string',
        },
        teamSize: {
          required: false,
          type: 'number',
        },
        level: {
          type: 'string',
          required: false,
        },
      });

      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }

      const result = await gameService.create(
        req.userInfo.user,
        body.name,
        body.teamSize,
        body.level,
      );
      return res.status(201).json({ ...result });
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
  async delete(req, res, next) {
    try {
      const game_id = req.params.gameId;

      const result = await gameService.delete(game_id);

      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

export default new GameController();
