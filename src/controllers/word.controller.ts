import ValidationException from '../exceptions/validationException';
import { validateObject } from '../helpers/validation';

class WordController {
  async getWord(req, res, next) {
    try {
      let result;
      // create getWord() method
      // result = await wordService.getWord();
      return res.status(201).json({ word: result });
    } catch (e) {
      return next(e);
    }
  }
}

export default new WordController();
