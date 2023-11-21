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
  async getUserById(req, res, next) {
    try {
      let result;
      // create getUser method
      // const result = await userService.getUser(req.params.userId);

      return res.status(200).json({
        ...result,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateStatistics(req, res, next) {
    try {
      // create updateStatistics method
      // await userService.updateStatistics(req.body);

      return res.status(200).json({
        message: 'User statistics was updated successfully.',
      });
    } catch (e) {
      return next(e);
    }
  }
  async deleteUser(req, res, next) {
    try {
      // create deleteUser method
      // await userService.deleteUser(req.body.userId);

      return res.status(204);
    } catch (e) {
      return next(e);
    }
  }
}

export default new UserController();
