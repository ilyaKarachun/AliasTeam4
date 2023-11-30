import HttpException from '../exceptions/httpException';
import { tokenService } from '../services/token.service';

const clientAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies['alias-token'];
    if (!token) {
      res.redirect('/login');
      return;
    }

    /**
     * verify token
     */
    const userData = tokenService.verifyToken(token);
    if (!userData) {
      res.redirect('/login');
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

export default clientAuthMiddleware;
