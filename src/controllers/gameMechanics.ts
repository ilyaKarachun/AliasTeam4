import { Request, Response, NextFunction } from 'express';
import gameMechanicsService from '../services/gameMechanics.service';
import randomWords from '../helpers/randomWords';

// interface WordsResult {
//   _id: string;
//   _rev: string;
//   type: string;
//   words: string[];
// }

class GameMechanicsController {
  private gameMechanicsService: gameMechanicsService;
  constructor(gameMechanicsService: gameMechanicsService) {
    this.gameMechanicsService = gameMechanicsService;
  }
  async getRandomWords(req: Request, res: Response, next: NextFunction) {
    try {
      const words = await this.gameMechanicsService.getWords();
      const randomWordsArray = randomWords(words);
      res.json({
        status: 'success',
        data: randomWordsArray,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default GameMechanicsController;
