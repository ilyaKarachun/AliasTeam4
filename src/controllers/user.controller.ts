import { Request, Response, NextFunction } from 'express';
import ValidationException from '../exceptions/validationException';
import { validateObject } from '../helpers/validation';
import { userService } from '../services/user.service';
import HttpException from '../exceptions/httpException';

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
      const loginResult = await userService.login({
        email: body.email,
        password: body.password,
      });
      return res
        .status(201)
        .json({ message: 'User successfully registered.', loginResult });
    } catch (e) {
      return next(e);
    }
  }

  async login(req, res, next) {
    try {
      const body = req.body;
      const errors = validateObject(body, {
        email: {
          type: 'email',
          required: true,
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
        email: body.email,
        password: body.password,
      });
      return res.status(200).json({ ...result });
    } catch (e) {
      return next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getUserById({ id: req.params.userId });
      if (!result) {
        throw new HttpException(404, 'User Was Not Found!');
      }

      return res.status(200).json({
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }

  async updateStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const errors = validateObject(body, {
        statistic: {
          type: 'string',
          required: true,
        },
      });
      if (errors.length) {
        throw new ValidationException(400, JSON.stringify(errors));
      }

      await userService.updateStatistics({
        statistic: body.statistic,
        id: req.params.userId,
      });

      return res.status(200).json({
        message: 'User statistics was updated successfully.',
      });
    } catch (e) {
      return next(e);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser({ id: req.params.userId });

      return res.status(204).send();
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await userService.getAll();
      return res.status(200).json({ result });
    } catch (e) {
      return next(e);
    }
  }
}

export default new UserController();
