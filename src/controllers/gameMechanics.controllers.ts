import { Request, Response, NextFunction } from 'express';
import gameMechanicsService from '../services/gameMechanics.service';
import { GameDao } from '../dao/game.dao';
const gameDAO = new GameDao();

class GameMechanicsController {
  async validateDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId, description } = req.body;

      const gameInfo = await gameDAO.getGameById(gameId);

      let checkingResult;

      if (gameInfo?.dto.words) {
        checkingResult = gameMechanicsService.rootWordRecognition(
          gameInfo.dto.words[gameInfo.dto.words.length - 1],
          description,
        );
      }
      res.json({
        status: 'success',
        data: checkingResult,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default GameMechanicsController;
