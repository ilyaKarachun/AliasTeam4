import { Request, Response, NextFunction } from 'express';
import ValidationException from '../exceptions/validationException';
import { validateObject } from '../helpers/validation';
import { userService } from '../services/user.service';

class UserController {
  async registration(req, res, next) {
    try {
      const body = req.body;
      const errors = validateObject(body, {
        username: {
          required: true,
          type: 'string',
        },
        email: {
          type: 'email',
          required: true,
        },
        password: {
          type: 'string',
          required: true,
          minLength: 8,
          num: true,
        },
      });

      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }

      await userService.registration(body);
      return res.status(201).json({ message: 'User successfully registered.' });
    } catch (e) {
      return next(e);
    }
  }

  async login(req, res, next) {
    try {
      const body = req.body;

      const errors = validateObject(body, {
        username: {
          required: true,
          type: 'string',
        },
        password: {
          type: 'string',
          required: true,
        },
      });

      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }

      const result = await userService.login({
        username: body.username,
        password: body.password,
      });
      return res.status(200).json({ ...result });
    } catch (e) {
      return next(e);
    }
  }
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getUserById(req.params.userId);

      return res.status(200).json({
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.updateStatistics(req.body, req.params.userId);

      return res.status(200).json({
        message: 'User statistics was updated successfully.',
      });
    } catch (e) {
      return next(e);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.body.userId);

      return res.status(204);
    } catch (e) {
      return next(e);
    }
  }
}

export default new UserController();
