import HttpException from '../exceptions/httpException';
import { tokenService } from '../services/token.service';

const authMiddleware = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    if (!token) {
      next(new HttpException(401, 'Session does not exit!'));
      return;
    }

    /**
     * verify token
     */
    const userData = tokenService.verifyToken(token);
    if (!userData) {
      next(new HttpException(401, 'Session does not exit!'));
      return;
    }

    /**
     * save user info in req object in order to use it in app
     */
    req.userInfo = userData;
    next();
  } catch (e) {
    next(e);
  }
};

export default authMiddleware;
