import { Request, Response, NextFunction } from 'express';
import ValidationException from '../exceptions/validationException';
import { validateObject } from '../helpers/validation';

class WordController {
  async addWord(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const errors = validateObject(body, {
        word: {
          required: true,
          type: 'string',
          minLength: 2,
        },
      });

      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }
      // create addWord() method
      // await wordService.addWord();
      return res.status(201).json({
        message: 'A new word was added.',
      });
    } catch (e) {
      next(e);
    }
  }
  async getRandomWord(req: Request, res: Response, next: NextFunction) {
    try {
      let result;
      // create getRandomWord() method
      // const result = await wordService.getRandomWord();
      return res.status(201).json({ word: result });
    } catch (e) {
      return next(e);
    }
  }
  async updateWord(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      const errors = validateObject(body, {
        word: {
          required: true,
          type: 'string',
          minLength: 2,
        },
      });

      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }
      // create updateWord() method
      // await wordService.updateWord(req.params.wordId, body);
      return res
        .status(200)
        .json({ message: `Your word was updated successfully.` });
    } catch (e) {
      return next(e);
    }
  }

  async deleteWord(req: Request, res: Response, next: NextFunction) {
    try {
      // create deleteWord() method
      // await wordService.deleteWord(req.params.wordId);
      return res.status(204);
    } catch (e) {
      return next(e);
    }
  }
}

export default new WordController();
