import { gameService } from '../services/game.service';

class GameController {
  async create(req, res, next) {
    try {
      const result = await gameService.create(req.userInfo.user);
      return res.status(200).json({ result });
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
  // async join(req, res, next) {
  //   try {
  //     const user_id = req.userInfo.id;
  //     const game_id = req.params.gameId;
  //     const teamNumber = req.query.team;

  //     const result = await gameService.join({
  //       user_id: user_id,
  //       game_id: game_id,
  //       number: teamNumber,
  //     });

  //     return res.status(200).json({
  //       // message: `You've joined to the team ${result.team}. Your chat id - ${result.chatId}`,
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // }
}

export default new GameController();
