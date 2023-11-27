import { Request, Response, NextFunction } from 'express';
import gameMechanicsService from '../services/gameMechanics.service';

class GameMechanicsController {
  async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;

      // const result: any = 'from db answ by game id' + gameId;

      const hiddenWord = gameMechanicsService.randomWord(
        result.level,
        result.words,
      );
      const nextTurn = gameMechanicsService.assignTeamAndUserTurn(result);

      // await "set update obj game - push full obj in result.tracker + hiddenWord in result.words"

      // start timer func
      console.log({ hiddenWord, ...nextTurn });
    } catch (e) {
      next(e);
    }
  }

  async pointMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId, messageContent } = req.body;

      // const result: any = 'db req' + gameId;

      const marker = gameMechanicsService.hiddenWordRecognition(
        result.words[result.words.length - 1],
        messageContent,
      );

      if (marker) {
        // await 'set update obj game - push result.score[result.tracker.active_team] +1';

        // await "set update obj game - push full obj hiddenWord in result.words"
        return { message: 'word are guessed' };
      } else {
        return { message: "word aren't guessed" };
      }
    } catch (e) {
      next(e);
    }
  }

  async newWord(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId } = req.params;
      // const result:any = "db req with level diff" + gameId

      const newHiddenWord = gameMechanicsService.randomWord(
        result.level,
        result.words,
      );

      // await "set update obj game - push new word in result.words"

      return { newHiddenWord: newHiddenWord };
    } catch (e) {
      next(e);
    }
  }

  async validateDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const body: { gameId: string; description: string } = req.body;

      // const result = 'get info by id';

      const checkingResult = gameMechanicsService.rootWordRecognition(
        result.words[result.words.length - 1],
        body.description,
      );
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
