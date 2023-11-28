import { Request, Response, NextFunction } from 'express';
import gameMechanicsService from '../services/gameMechanics.service';
import { GameDao } from '../dao/game.dao';
const gameDAO = new GameDao();

class GameMechanicsController {
  // async pointMessage(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { gameId, messageContent } = req.body;

  //     const result: any = 'db req' + gameId;

  //     const marker = gameMechanicsService.hiddenWordRecognition(
  //       result.words[result.words.length - 1],
  //       messageContent,
  //     );

  //     if (marker) {
  //       // await 'set update obj game - push result.score[result.tracker.active_team] +1';

  //       // await "set update obj game - push full obj hiddenWord in result.words"
  //       return { message: 'word are guessed' };
  //     } else {
  //       return { message: "word aren't guessed" };
  //     }
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  async newWord(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      const gameInfo = await gameDAO.getGameById(gameId);

      if (gameInfo) {
        const newHiddenWord = gameMechanicsService.randomWord(
          gameInfo.dto.level,
          gameInfo.dto.words,
        );

        await gameDAO.updateGameFields(gameId, {
          words: [...gameInfo.dto.words, newHiddenWord],
        });
        return { newHiddenWord: newHiddenWord };
      }
    } catch (e) {
      next(e);
    }
  }

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

  async scoreCounting(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;

      const result: any = 'db req game' + gameId;

      if (result.score.team_1 > result.score.team_2) {
        // await 'set update obj game - push result.won "team_1"';
        return { message: 'the winner is team_1' };
      } else {
        // await 'set update obj game - push result.won "team_2"';
        return { message: 'the winner is team_2' };
      }
    } catch (e) {
      next(e);
    }
  }
}

export default GameMechanicsController;
