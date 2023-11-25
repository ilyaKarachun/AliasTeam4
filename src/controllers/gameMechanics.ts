import { Request, Response, NextFunction } from 'express';
import gameMechanicsService from '../services/gameMechanics.service';
import randomWords from '../helpers/randomWords';
import rootWordRecognition from '../helpers/rootWordRecognition';

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

  async validateDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const body: { teamId: string; description: string; hiddenWord: string } =
        req.body;

      const checkingResult = rootWordRecognition(
        body.hiddenWord,
        body.description,
      );
      //front decide by status should it disable the button or not
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
