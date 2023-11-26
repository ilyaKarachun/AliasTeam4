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
}

export default new GameController();
